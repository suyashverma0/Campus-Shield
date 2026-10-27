# Campus Shield – AI Image-Matching Service

Stateless FastAPI service: turns item photos into ResNet50 embeddings and ranks lost-item candidates by cosine
similarity. It has **no database access and no auth**; MongoDB, image storage, authorization and contact privacy
stay in the Node.js/Express backend.

## Status (read first)
| Item | Status |
|---|---|
| Unit + API tests (55) | Pass, using **randomly initialised weights**. They verify plumbing, not match quality. |
| Endpoints run live (uvicorn + curl) | Yes, with random weights. |
| Pretrained ImageNet weights | **Not run yet** (the development sandbox could not download them). |
| Real lost/found matching quality | **Not evaluated.** Run `scripts/evaluate.py` on labelled images before trusting any score. |

Random-weight scores are meaningless (unrelated images score ~0.999). Every embedding carries a model version
(`resnet50-random-init-v1` vs `resnet50-imagenet-v1`) so they are never mixed.

## Setup
```bash
cd ai-service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt     # CPU is enough; no paid APIs
pytest -q                           # no download needed (tests use architecture-only weights)
uvicorn app.main:app --port 8000    # first start downloads ResNet50 ImageNet weights (~100 MB)
```
Confirm `GET /health` shows `"model_ready": true` and `"model_version": "resnet50-imagenet-v1"`.

Env vars (prefix `CS_`): `MODEL_WEIGHTS` (`imagenet` | `none` | path to fine-tuned `.pth`), `DEVICE`,
`MAX_IMAGE_BYTES` (5 MB), `MAX_COMPARE_CANDIDATES` (20), `MAX_MATCH_CANDIDATES` (2000), `DEFAULT_TOP_K` (5),
`DEFAULT_THRESHOLD` (unset on purpose).

## Integration contract
| Endpoint | Input | Output |
|---|---|---|
| `GET /health` | – | `status`, `model_ready`, `model_version`, `error` |
| `POST /extract-features` | multipart `image` | `embedding` (2048 floats, L2-normalised), `dimension`, `model_version` |
| `POST /compare` | multipart `query_image` + `candidate_images[]` and/or form field `candidate_embeddings` (JSON `[{id, embedding, model_version?}]`), optional `top_k` | `results[{candidate_id, similarity_score}]`, `skipped[]` |
| `POST /match` | JSON: `query_item_id`, `query_embedding`, `query_model_version`, `candidates[{lost_item_id, embedding, model_version}]`, optional `top_k`, `threshold` | `query_item_id`, `matches[{lost_item_id, similarity_score, model_version}]`, `skipped[]`, `candidates_considered`, `threshold_applied` |

Errors (`{"detail": "..."}`): 400 empty/corrupt/too-small image, 413 too large, 415 not JPEG/PNG/WEBP,
422 schema or bad embedding, 503 model not loaded.

Backend rules:
- Store `embedding` + `embeddingModelVersion` per item; call `/extract-features` once per image.
- `/match` skips candidates whose `model_version` differs from the query and reports them in `skipped`; re-embed those.
- The backend chooses the threshold (from evaluation) and sends it per request. Without one, top-k is returned however
  weak the scores are, so the UI must not present them as likely matches.
- Up to ~2000 candidates per `/match` call (large JSON). Batch, or add a vector index later;
  `rank_candidates` in `app/services/similarity.py` is the swap point.
- A similarity score is **not** a probability that two photos show the same physical object.

Examples: `examples/requests.md`.

## Compare two local images
```bash
python scripts/compare_images.py lost.jpg found.jpg
```

## Research evaluation
```bash
python scripts/evaluate.py --manifest manifest.csv --root images/ --out report.json
```
Manifest columns: `image_path,object_id,role,condition` (`role` lost|found; same `object_id` = same physical
object; `condition` labels the found photo, e.g. `angle`, `lighting`, `background`). Found items whose object has no
lost photo act as negative queries. Report: Precision@K, Recall@K, hit@K, MRR, per-condition breakdown, and a
threshold sweep (TP/FP/FN, precision, recall, false-alarm queries). Pick the threshold from held-out data.

**Known limitation:** generic ImageNet ResNet50 embeddings capture broad visual similarity (category, colour, shape).
They may not tell two different black backpacks apart, and may miss the same item under a different angle, light or
background. State this in the write-up. The extractor is isolated in `app/models/feature_extractor.py`; set
`CS_MODEL_WEIGHTS=/path/model.pth` to evaluate a fine-tuned model with the same script.

## Layout
```
app/main.py                       app factory + endpoints
app/config.py                     settings
app/schemas/                      Pydantic models
app/models/feature_extractor.py   ResNet50 embedding extractor
app/services/                     similarity, image_validation, matching, metrics
scripts/                          compare_images.py, evaluate.py
tests/                            pytest suite
```
