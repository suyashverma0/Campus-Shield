import pytest

from app.services.metrics import (QueryResult, breakdown_by_tag, precision_at_k, ranking_report,
                                  recall_at_k, reciprocal_rank, threshold_sweep)

RANKED = ["a", "b", "c", "d"]


def test_precision_recall_rr():
    rel = {"b", "d"}
    assert precision_at_k(RANKED, rel, 2) == 0.5
    assert recall_at_k(RANKED, rel, 2) == 0.5
    assert recall_at_k(RANKED, rel, 4) == 1.0
    assert reciprocal_rank(RANKED, rel) == 0.5
    assert reciprocal_rank(RANKED, {"zzz"}) == 0.0


def _results():
    return [
        QueryResult("q1", {"a": 0.9, "b": 0.4, "c": 0.2}, {"a"}, "angle"),
        QueryResult("q2", {"a": 0.5, "b": 0.8, "c": 0.1}, {"a"}, "lighting"),   # true match ranked 2nd
        QueryResult("q3", {"a": 0.7, "b": 0.3, "c": 0.1}, set(), "angle"),      # negative query
    ]


def test_ranking_report_ignores_negative_queries():
    rep = ranking_report(_results(), [1, 2])
    assert rep["queries_with_true_match"] == 2
    assert rep["hit@1"] == 0.5 and rep["hit@2"] == 1.0
    assert rep["mrr"] == pytest.approx(0.75)


def test_threshold_sweep_counts():
    row = threshold_sweep(_results(), [0.6])[0]
    # >=0.6: q1 a(TP), q2 b(FP), q3 a(FP; negative query -> false alarm). q2's true match 0.5 -> FN
    assert (row["tp"], row["fp"], row["fn"], row["false_alarm_queries"]) == (1, 2, 1, 1)


def test_breakdown_by_tag():
    b = breakdown_by_tag(_results(), [1])
    assert set(b) == {"angle", "lighting"} and b["lighting"]["hit@1"] == 0.0
