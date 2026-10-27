"""Research evaluation on a labelled image set.

Manifest CSV columns:  image_path, object_id, role, condition
  role      : lost | found
  object_id : same value == same physical object (a found image with no lost image of that
              object is a valid *negative* query and drives the false-alarm count)
  condition : optional tag for the FOUND image, e.g. angle / lighting / background / baseline

Usage:
  python scripts/evaluate.py --manifest data/manifest.csv --root data/ --out report.json
"""
import _bootstrap  # noqa: F401
import argparse
import csv
import json
import sys
from pathlib import Path

import numpy as np

from app.config import Settings
from app.models.feature_extractor import FeatureExtractor
from app.services.image_validation import load_and_validate_image
from app.services.metrics import QueryResult, breakdown_by_tag, ranking_report, threshold_sweep


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", required=True)
    ap.add_argument("--root", default=".")
    ap.add_argument("--weights", default=None)
    ap.add_argument("--ks", type=int, nargs="+", default=[1, 3, 5, 10])
    ap.add_argument("--thresholds", type=float, nargs="+", default=[round(x, 2) for x in np.arange(0.3, 1.0, 0.05)])
    ap.add_argument("--out", default=None)
    a = ap.parse_args()

    s = Settings()
    ex = FeatureExtractor(a.weights or s.model_weights, s.device)
    rows = list(csv.DictReader(open(a.manifest, newline="")))
    lost, found = [], []
    for r in rows:
        with open(Path(a.root) / r["image_path"], "rb") as f:
            img = load_and_validate_image(f.read(), max_bytes=s.max_image_bytes,
                                          max_pixels=s.max_image_pixels, min_side=s.min_image_side)
        emb = ex.extract(img).astype(np.float64)
        (lost if r["role"].strip() == "lost" else found).append((r, emb))
    if not lost or not found:
        print("manifest needs both lost and found rows", file=sys.stderr)
        return 1

    L = np.vstack([e for _, e in lost])
    results = []
    for r, e in found:
        scores = L @ e  # embeddings are unit length -> dot == cosine
        sc = {f"{lr['object_id']}#{i}": float(v) for i, ((lr, _), v) in enumerate(zip(lost, scores))}
        rel = {k for k in sc if k.split("#")[0] == r["object_id"]}
        results.append(QueryResult(r["image_path"], sc, rel, (r.get("condition") or "").strip()))

    report = {
        "model_version": ex.model_version,
        "n_lost": len(lost), "n_found": len(found),
        "overall": ranking_report(results, a.ks),
        "by_condition": breakdown_by_tag(results, a.ks),
        "threshold_sweep": threshold_sweep(results, a.thresholds),
    }
    if "random-init" in ex.model_version:
        report["warning"] = "random weights: results are meaningless"
    text = json.dumps(report, indent=2)
    print(text)
    if a.out:
        Path(a.out).write_text(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
