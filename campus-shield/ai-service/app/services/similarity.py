"""Cosine similarity and ranking. Pure NumPy, no model dependency."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Sequence

import numpy as np

_EPS = 1e-12


class InvalidEmbeddingError(ValueError):
    """Raised when an embedding is empty, non-numeric, non-finite or the wrong shape."""


def to_vector(x: Any) -> np.ndarray:
    try:
        v = np.asarray(x, dtype=np.float64)
    except (TypeError, ValueError) as exc:
        raise InvalidEmbeddingError("embedding must be a list of numbers") from exc
    if v.ndim != 1 or v.size == 0:
        raise InvalidEmbeddingError("embedding must be a non-empty 1-D vector")
    if not np.all(np.isfinite(v)):
        raise InvalidEmbeddingError("embedding contains NaN or infinite values")
    return v


def l2_normalize(v: np.ndarray) -> np.ndarray:
    """Unit-length copy. A zero vector is returned unchanged (it has no direction)."""
    n = np.linalg.norm(v)
    return v if n < _EPS else v / n


def cosine_similarity(a: Any, b: Any) -> float:
    """dot(A, B) / (norm(A) * norm(B)).

    Raises InvalidEmbeddingError for malformed input or mismatched dimensions.
    Returns 0.0 if either vector is all zeros (similarity is undefined there).
    """
    va, vb = to_vector(a), to_vector(b)
    if va.shape != vb.shape:
        raise InvalidEmbeddingError(f"dimension mismatch: {va.shape[0]} vs {vb.shape[0]}")
    na, nb = np.linalg.norm(va), np.linalg.norm(vb)
    if na < _EPS or nb < _EPS:
        return 0.0
    return float(np.clip(np.dot(va, vb) / (na * nb), -1.0, 1.0))


@dataclass
class RankResult:
    ranked: list[tuple[str, float]] = field(default_factory=list)  # (id, score), best first
    skipped: list[tuple[str, str]] = field(default_factory=list)   # (id, reason)
    considered: int = 0


def rank_candidates(
    query: Any,
    candidates: Sequence[tuple[str, Any]],
    top_k: int | None = None,
    threshold: float | None = None,
) -> RankResult:
    """Rank candidates by cosine similarity to the query (descending).

    Invalid candidates are skipped and reported, never silently scored.
    An invalid query raises InvalidEmbeddingError.
    """
    q = to_vector(query)
    qn = np.linalg.norm(q)
    if qn < _EPS:
        raise InvalidEmbeddingError("query embedding is a zero vector")
    q = q / qn

    result = RankResult()
    ids: list[str] = []
    rows: list[np.ndarray] = []
    for cid, emb in candidates:
        try:
            v = to_vector(emb)
        except InvalidEmbeddingError as exc:
            result.skipped.append((cid, str(exc)))
            continue
        if v.shape != q.shape:
            result.skipped.append((cid, f"dimension mismatch: {v.shape[0]} vs {q.shape[0]}"))
            continue
        n = np.linalg.norm(v)
        if n < _EPS:
            result.skipped.append((cid, "zero vector"))
            continue
        ids.append(cid)
        rows.append(v / n)

    result.considered = len(ids)
    if not ids:
        return result

    scores = np.clip(np.vstack(rows) @ q, -1.0, 1.0)
    order = np.argsort(-scores, kind="stable")
    for i in order:
        s = float(scores[i])
        if threshold is not None and s < threshold:
            break  # sorted descending
        result.ranked.append((ids[i], s))
        if top_k is not None and len(result.ranked) >= top_k:
            break
    return result
