"""Retrieval metrics for the research evaluation. Pure Python/NumPy."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Sequence


@dataclass
class QueryResult:
    query_id: str
    scores: dict[str, float]            # candidate_id -> cosine similarity
    relevant: set[str]                  # candidate ids that are the SAME physical object (may be empty)
    tag: str = ""                       # e.g. "angle", "lighting", "background"

    def ranked(self) -> list[str]:
        return [k for k, _ in sorted(self.scores.items(), key=lambda kv: -kv[1])]


def precision_at_k(ranked: Sequence[str], relevant: set[str], k: int) -> float:
    return sum(1 for r in ranked[:k] if r in relevant) / k


def recall_at_k(ranked: Sequence[str], relevant: set[str], k: int) -> float:
    return sum(1 for r in ranked[:k] if r in relevant) / len(relevant) if relevant else float("nan")


def reciprocal_rank(ranked: Sequence[str], relevant: set[str]) -> float:
    for i, r in enumerate(ranked, 1):
        if r in relevant:
            return 1.0 / i
    return 0.0


def _mean(xs: list[float]) -> float:
    xs = [x for x in xs if x == x]  # drop NaN
    return sum(xs) / len(xs) if xs else float("nan")


def ranking_report(results: Sequence[QueryResult], ks: Sequence[int]) -> dict:
    """Averages over queries that have at least one true match."""
    pos = [r for r in results if r.relevant]
    out: dict = {"queries_with_true_match": len(pos), "queries_total": len(results)}
    for k in ks:
        out[f"precision@{k}"] = _mean([precision_at_k(r.ranked(), r.relevant, k) for r in pos])
        out[f"recall@{k}"] = _mean([recall_at_k(r.ranked(), r.relevant, k) for r in pos])
        out[f"hit@{k}"] = _mean([float(any(c in r.relevant for c in r.ranked()[:k])) for r in pos])
    out["mrr"] = _mean([reciprocal_rank(r.ranked(), r.relevant) for r in pos])
    return out


def threshold_sweep(results: Sequence[QueryResult], thresholds: Sequence[float]) -> list[dict]:
    """Pair-level counts for 'score >= threshold' being declared a candidate match.

    false_alarm_queries: found items with NO true lost counterpart that still got >=1 candidate.
    """
    rows = []
    for t in thresholds:
        tp = fp = fn = fa = 0
        for r in results:
            for cid, s in r.scores.items():
                hit = s >= t
                if cid in r.relevant:
                    tp += hit
                    fn += not hit
                elif hit:
                    fp += 1
            if not r.relevant and any(s >= t for s in r.scores.values()):
                fa += 1
        rows.append({
            "threshold": t, "tp": tp, "fp": fp, "fn": fn,
            "precision": tp / (tp + fp) if tp + fp else float("nan"),
            "recall": tp / (tp + fn) if tp + fn else float("nan"),
            "false_alarm_queries": fa,
        })
    return rows


def breakdown_by_tag(results: Sequence[QueryResult], ks: Sequence[int]) -> dict[str, dict]:
    tags = sorted({r.tag for r in results if r.tag})
    return {t: ranking_report([r for r in results if r.tag == t], ks) for t in tags}
