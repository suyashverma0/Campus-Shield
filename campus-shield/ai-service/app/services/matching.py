"""Business logic behind POST /match. No database access: the backend supplies the embeddings."""
from __future__ import annotations

from app.schemas import MatchItem, MatchRequest, MatchResponse, SkippedItem
from app.services.similarity import rank_candidates


def run_match(req: MatchRequest, *, top_k: int, threshold: float | None) -> MatchResponse:
    usable, skipped = [], []
    for c in req.candidates:
        if c.model_version != req.query_model_version:
            skipped.append(SkippedItem(
                lost_item_id=c.lost_item_id,
                reason=f"model_version_mismatch ({c.model_version} != {req.query_model_version}); re-embed this item",
            ))
        else:
            usable.append((c.lost_item_id, c.embedding))

    ranked = rank_candidates(req.query_embedding, usable, top_k=top_k, threshold=threshold)
    skipped += [SkippedItem(lost_item_id=i, reason=r) for i, r in ranked.skipped]
    return MatchResponse(
        query_item_id=req.query_item_id,
        matches=[MatchItem(lost_item_id=i, similarity_score=round(s, 6), model_version=req.query_model_version)
                 for i, s in ranked.ranked],
        skipped=skipped,
        candidates_considered=ranked.considered,
        threshold_applied=threshold,
    )
