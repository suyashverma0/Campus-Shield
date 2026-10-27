"""Compare two local images:  python scripts/compare_images.py a.jpg b.jpg [--weights imagenet|none|PATH]"""
import _bootstrap  # noqa: F401
import argparse
import sys

from app.config import Settings
from app.models.feature_extractor import FeatureExtractor, ModelLoadError
from app.services.image_validation import ImageValidationError, load_and_validate_image
from app.services.similarity import cosine_similarity


def load(path: str, s: Settings):
    with open(path, "rb") as f:
        return load_and_validate_image(
            f.read(), max_bytes=s.max_image_bytes, max_pixels=s.max_image_pixels, min_side=s.min_image_side
        )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("image_a"); ap.add_argument("image_b")
    ap.add_argument("--weights", default=None, help="overrides CS_MODEL_WEIGHTS")
    a = ap.parse_args()
    s = Settings()
    try:
        ex = FeatureExtractor(a.weights or s.model_weights, s.device)
        ea, eb = ex.extract(load(a.image_a, s)), ex.extract(load(a.image_b, s))
    except (ModelLoadError, ImageValidationError, OSError) as e:
        print(f"error: {getattr(e, 'message', e)}", file=sys.stderr)
        return 1
    print(f"model_version: {ex.model_version}")
    print(f"cosine_similarity: {cosine_similarity(ea, eb):.4f}")
    if "random-init" in ex.model_version:
        print("WARNING: random weights - this score is meaningless.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
