from __future__ import annotations

from pydantic import BaseModel, Field

Embedding = list[float]


class HealthResponse(BaseModel):
    status: str                       # "ok" | "degraded"
    model_ready: bool
    model_version: str | None = None
    device: str | None = None
    error: str | None = None


class ExtractFeaturesResponse(BaseModel):
    embedding: Embedding
    dimension: int
    normalized: bool = True
    model_version: str


class ErrorResponse(BaseModel):
    detail: str


# ---- /compare -------------------------------------------------------------------------
class CompareResult(BaseModel):
    candidate_id: str
    similarity_score: float


class CompareResponse(BaseModel):
    model_version: str
    results: list[CompareResult]
    skipped: list[dict[str, str]] = []


# ---- /match ---------------------------------------------------------------------------
class MatchCandidate(BaseModel):
    lost_item_id: str = Field(min_length=1, max_length=128)
    embedding: Embedding = Field(min_length=1, max_length=8192)
    model_version: str = Field(min_length=1, max_length=128)


class MatchRequest(BaseModel):
    query_item_id: str = Field(min_length=1, max_length=128)
    query_embedding: Embedding = Field(min_length=1, max_length=8192)
    query_model_version: str = Field(min_length=1, max_length=128)
    candidates: list[MatchCandidate]
    top_k: int | None = Field(default=None, ge=1)
    threshold: float | None = Field(default=None, ge=-1.0, le=1.0)


class MatchItem(BaseModel):
    lost_item_id: str
    similarity_score: float
    model_version: str


class SkippedItem(BaseModel):
    lost_item_id: str
    reason: str


class MatchResponse(BaseModel):
    query_item_id: str
    matches: list[MatchItem]
    skipped: list[SkippedItem] = []
    candidates_considered: int
    threshold_applied: float | None = None
