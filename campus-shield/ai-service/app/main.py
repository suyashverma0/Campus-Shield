"""Campus Shield AI service. Stateless: no database, no auth. See README for the contract."""
from __future__ import annotations

import json
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

from app.config import Settings
from app.models.feature_extractor import FeatureExtractor, ModelLoadError
from app.schemas import (
    CompareResponse, CompareResult, ExtractFeaturesResponse, HealthResponse,
    MatchRequest, MatchResponse,
)
from app.services.image_validation import ImageValidationError, load_and_validate_image
from app.services.matching import run_match
from app.services.similarity import InvalidEmbeddingError, rank_candidates

log = logging.getLogger("campus_shield.ai")


def create_app(settings: Settings | None = None, extractor: FeatureExtractor | None = None) -> FastAPI:
    settings = settings or Settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        app.state.load_error = None
        app.state.extractor = extractor
        if extractor is None:
            try:
                app.state.extractor = FeatureExtractor(settings.model_weights, settings.device)
                log.info("Model ready: %s", app.state.extractor.model_version)
            except ModelLoadError as exc:
                app.state.load_error = str(exc)
                log.error("%s", exc)
        yield

    app = FastAPI(title="Campus Shield AI Service", version="1.0.0", lifespan=lifespan)
    app.state.settings = settings

    # ---- helpers ----------------------------------------------------------------------
    def get_extractor() -> FeatureExtractor:
        ex = app.state.extractor
        if ex is None:
            raise HTTPException(503, f"Model not ready: {app.state.load_error or 'still loading'}")
        return ex

    def read_image(upload: UploadFile):
        data = upload.file.read(settings.max_image_bytes + 1)
        return load_and_validate_image(
            data, max_bytes=settings.max_image_bytes,
            max_pixels=settings.max_image_pixels, min_side=settings.min_image_side,
        )

    # ---- error handling / size limits -------------------------------------------------
    @app.exception_handler(ImageValidationError)
    async def _img_err(_: Request, exc: ImageValidationError):
        return JSONResponse({"detail": exc.message}, status_code=exc.status_code)

    @app.middleware("http")
    async def limit_body(request: Request, call_next):
        declared = request.headers.get("content-length")
        if declared and declared.isdigit():
            ctype = request.headers.get("content-type", "")
            if "multipart" in ctype:
                limit = settings.max_image_bytes * (settings.max_compare_candidates + 1) + 1_000_000
            else:
                limit = settings.max_json_body_bytes
            if int(declared) > limit:
                return JSONResponse({"detail": "Request body too large."}, status_code=413)
        return await call_next(request)

    # ---- endpoints --------------------------------------------------------------------
    @app.get("/health", response_model=HealthResponse)
    def health():
        ex = app.state.extractor
        if ex is None:
            return HealthResponse(status="degraded", model_ready=False, error=app.state.load_error or "loading")
        return HealthResponse(status="ok", model_ready=True, model_version=ex.model_version, device=str(ex.device))

    @app.post("/extract-features", response_model=ExtractFeaturesResponse)
    def extract_features(image: UploadFile = File(...)):
        ex = get_extractor()
        emb = ex.extract(read_image(image))
        return ExtractFeaturesResponse(
            embedding=emb.tolist(), dimension=int(emb.shape[0]), model_version=ex.model_version
        )

    @app.post("/compare", response_model=CompareResponse)
    def compare(
        query_image: UploadFile = File(...),
        candidate_images: list[UploadFile] = File(default=[]),
        candidate_embeddings: str | None = Form(
            default=None,
            description='Optional JSON: [{"id": "lost_1", "embedding": [...], "model_version": "..."}]',
        ),
        top_k: int | None = Form(default=None, ge=1),
    ):
        ex = get_extractor()
        if not candidate_images and not candidate_embeddings:
            raise HTTPException(400, "Provide candidate_images and/or candidate_embeddings.")
        if len(candidate_images) > settings.max_compare_candidates:
            raise HTTPException(413, f"At most {settings.max_compare_candidates} candidate images per request.")

        query = ex.extract(read_image(query_image))
        cands: list[tuple[str, object]] = []
        skipped: list[dict[str, str]] = []

        if candidate_images:
            imgs = [read_image(f) for f in candidate_images]
            embs = ex.extract_batch(imgs)
            for i, (f, e) in enumerate(zip(candidate_images, embs)):
                cands.append((f.filename or f"candidate_{i}", e))

        if candidate_embeddings:
            try:
                items = json.loads(candidate_embeddings)
                assert isinstance(items, list) and len(items) <= settings.max_match_candidates
                for it in items:
                    if it.get("model_version") not in (None, ex.model_version):
                        skipped.append({"id": str(it["id"]), "reason": "model_version_mismatch"})
                    else:
                        cands.append((str(it["id"]), it["embedding"]))
            except (ValueError, AssertionError, KeyError, TypeError, AttributeError):
                raise HTTPException(422, "candidate_embeddings must be a JSON list of {id, embedding[, model_version]}.")

        ranked = rank_candidates(query, cands, top_k=top_k)
        skipped += [{"id": i, "reason": r} for i, r in ranked.skipped]
        return CompareResponse(
            model_version=ex.model_version,
            results=[CompareResult(candidate_id=i, similarity_score=round(s, 6)) for i, s in ranked.ranked],
            skipped=skipped,
        )

    @app.post("/match", response_model=MatchResponse)
    def match(req: MatchRequest):
        if len(req.candidates) > settings.max_match_candidates:
            raise HTTPException(413, f"At most {settings.max_match_candidates} candidates per request; batch them.")
        top_k = min(req.top_k or settings.default_top_k, settings.max_top_k)
        threshold = req.threshold if req.threshold is not None else settings.default_threshold
        try:
            return run_match(req, top_k=top_k, threshold=threshold)
        except InvalidEmbeddingError as exc:
            raise HTTPException(422, f"Invalid query embedding: {exc}")

    return app


app = create_app()
