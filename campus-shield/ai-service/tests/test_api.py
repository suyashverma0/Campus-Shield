import json

import pytest

from tests.conftest import make_image


def png(seed):
    return ("f.png", make_image(seed), "image/png")


def test_health_ok(client):
    r = client.get("/health").json()
    assert r["status"] == "ok" and r["model_ready"] and r["model_version"]


def test_health_degraded_when_weights_missing(broken_client):
    r = broken_client.get("/health").json()
    assert r["status"] == "degraded" and not r["model_ready"] and "weights" in r["error"]


def test_extract_503_when_model_not_ready(broken_client):
    assert broken_client.post("/extract-features", files={"image": png(1)}).status_code == 503


def test_extract_features_valid(client):
    r = client.post("/extract-features", files={"image": png(1)})
    assert r.status_code == 200
    body = r.json()
    assert body["dimension"] == 2048 == len(body["embedding"]) and body["model_version"]


@pytest.mark.parametrize("payload,code", [
    (("x.txt", b"not an image", "text/plain"), 415),
    (("x.png", b"", "image/png"), 400),
    (("x.png", b"\x89PNG\r\n\x1a\ngarbage", "image/png"), 415),
])
def test_extract_rejects_bad_files(client, payload, code):
    assert client.post("/extract-features", files={"image": payload}).status_code == code


def test_extract_rejects_oversize(client):
    big = ("b.png", b"0" * 300_000, "image/png")
    assert client.post("/extract-features", files={"image": big}).status_code == 413


def test_extract_missing_file_is_422(client):
    assert client.post("/extract-features").status_code == 422


def test_compare_identical_image_ranks_first_with_score_one(client):
    files = [("query_image", ("q.png", make_image(1), "image/png")),
             ("candidate_images", ("other_a.png", make_image(2), "image/png")),
             ("candidate_images", ("same.png", make_image(1), "image/png")),
             ("candidate_images", ("other_b.png", make_image(3), "image/png"))]
    r = client.post("/compare", files=files)
    assert r.status_code == 200
    res = r.json()["results"]
    assert res[0]["candidate_id"] == "same.png" and res[0]["similarity_score"] == pytest.approx(1.0, abs=1e-4)
    assert res[0]["similarity_score"] >= res[1]["similarity_score"] >= res[2]["similarity_score"]


def test_compare_with_embeddings(client):
    emb = client.post("/extract-features", files={"image": png(5)}).json()
    cands = json.dumps([{"id": "lost_1", "embedding": emb["embedding"], "model_version": emb["model_version"]},
                        {"id": "stale", "embedding": emb["embedding"], "model_version": "old"}])
    r = client.post("/compare", files={"query_image": png(5)}, data={"candidate_embeddings": cands})
    body = r.json()
    assert r.status_code == 200 and body["results"][0]["candidate_id"] == "lost_1"
    assert body["skipped"][0]["id"] == "stale"


def test_compare_requires_candidates(client):
    assert client.post("/compare", files={"query_image": png(1)}).status_code == 400


def test_compare_bad_embeddings_json(client):
    r = client.post("/compare", files={"query_image": png(1)}, data={"candidate_embeddings": "{nope"})
    assert r.status_code == 422


def test_compare_too_many_candidates(client):
    files = [("query_image", png(1))] + [("candidate_images", png(2))] * 21
    assert client.post("/compare", files=files).status_code == 413


def _req(**over):
    base = {"query_item_id": "found_1", "query_embedding": [1, 0, 0], "query_model_version": "m1",
            "candidates": [
                {"lost_item_id": "lost_a", "embedding": [0, 1, 0], "model_version": "m1"},
                {"lost_item_id": "lost_b", "embedding": [1, 0.1, 0], "model_version": "m1"},
                {"lost_item_id": "lost_old", "embedding": [1, 0, 0], "model_version": "m0"},
                {"lost_item_id": "lost_zero", "embedding": [0, 0, 0], "model_version": "m1"}]}
    return {**base, **over}


def test_match_ranks_and_reports_skips(client):
    r = client.post("/match", json=_req())
    assert r.status_code == 200
    b = r.json()
    assert b["query_item_id"] == "found_1"
    assert [m["lost_item_id"] for m in b["matches"]] == ["lost_b", "lost_a"]
    assert all(m["model_version"] == "m1" for m in b["matches"])
    assert {s["lost_item_id"] for s in b["skipped"]} == {"lost_old", "lost_zero"}


def test_match_threshold_and_top_k(client):
    assert [m["lost_item_id"] for m in client.post("/match", json=_req(threshold=0.5)).json()["matches"]] == ["lost_b"]
    assert len(client.post("/match", json=_req(top_k=1)).json()["matches"]) == 1


def test_match_no_candidates_returns_empty(client):
    b = client.post("/match", json=_req(candidates=[])).json()
    assert b["matches"] == []


def test_match_zero_query_is_422(client):
    assert client.post("/match", json=_req(query_embedding=[0, 0, 0])).status_code == 422


def test_match_schema_errors_are_422(client):
    assert client.post("/match", json={"query_item_id": "x"}).status_code == 422
    assert client.post("/match", json=_req(threshold=5)).status_code == 422


def test_match_too_many_candidates(client):
    cands = [{"lost_item_id": f"l{i}", "embedding": [1, 0, 0], "model_version": "m1"} for i in range(51)]
    assert client.post("/match", json=_req(candidates=cands)).status_code == 413
