import math

import numpy as np
import pytest

from app.services.similarity import InvalidEmbeddingError, cosine_similarity, rank_candidates


def test_identical_orthogonal_opposite():
    assert cosine_similarity([1, 2, 3], [1, 2, 3]) == pytest.approx(1.0)
    assert cosine_similarity([1, 0], [0, 1]) == pytest.approx(0.0)
    assert cosine_similarity([1, 1], [-1, -1]) == pytest.approx(-1.0)


def test_scale_invariant():
    assert cosine_similarity([1, 2, 3], [10, 20, 30]) == pytest.approx(1.0)


def test_zero_vector_is_zero_not_nan():
    assert cosine_similarity([0, 0, 0], [1, 2, 3]) == 0.0


@pytest.mark.parametrize("bad", [[], [math.nan, 1], [math.inf, 1], "abc", [[1, 2], [3, 4]], None])
def test_invalid_embeddings_raise(bad):
    with pytest.raises(InvalidEmbeddingError):
        cosine_similarity(bad, [1, 2])


def test_dimension_mismatch_raises():
    with pytest.raises(InvalidEmbeddingError):
        cosine_similarity([1, 2], [1, 2, 3])


def test_rank_orders_descending_and_respects_top_k():
    q = [1, 0, 0]
    cands = [("far", [0, 1, 0]), ("near", [0.9, 0.1, 0]), ("same", [2, 0, 0])]
    r = rank_candidates(q, cands, top_k=2)
    assert [i for i, _ in r.ranked] == ["same", "near"]


def test_rank_threshold_filters():
    r = rank_candidates([1, 0], [("a", [1, 0]), ("b", [0, 1])], threshold=0.5)
    assert [i for i, _ in r.ranked] == ["a"]


def test_rank_skips_bad_candidates_and_reports_them():
    r = rank_candidates([1, 0], [("ok", [1, 0]), ("nan", [math.nan, 0]), ("zero", [0, 0]), ("dim", [1, 0, 0])])
    assert [i for i, _ in r.ranked] == ["ok"]
    assert {i for i, _ in r.skipped} == {"nan", "zero", "dim"}


def test_rank_invalid_query_raises():
    with pytest.raises(InvalidEmbeddingError):
        rank_candidates([0, 0], [("a", [1, 0])])


def test_rank_empty_candidates():
    assert rank_candidates([1, 0], []).ranked == []
