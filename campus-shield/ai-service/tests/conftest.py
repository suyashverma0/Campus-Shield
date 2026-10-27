import io
import sys
from pathlib import Path

import numpy as np
import pytest
import torch
from fastapi.testclient import TestClient
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.config import Settings  # noqa: E402
from app.main import create_app  # noqa: E402
from app.models.feature_extractor import FeatureExtractor  # noqa: E402


def make_image(seed: int, size=(160, 160), fmt="PNG") -> bytes:
    """Deterministic synthetic image (coloured blocks). For plumbing tests only."""
    rng = np.random.RandomState(seed)
    small = rng.randint(0, 255, (8, 8, 3), dtype=np.uint8)
    img = Image.fromarray(small).resize(size, Image.NEAREST)
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return buf.getvalue()


@pytest.fixture(scope="session")
def extractor():
    torch.manual_seed(0)
    return FeatureExtractor(weights="none", device="cpu")  # random weights: tests plumbing, not quality


@pytest.fixture(scope="session")
def settings():
    return Settings(model_weights="none", max_image_bytes=200_000, max_match_candidates=50)


@pytest.fixture()
def client(settings, extractor):
    with TestClient(create_app(settings, extractor=extractor)) as c:
        yield c


@pytest.fixture()
def broken_client():
    s = Settings(model_weights="/nonexistent/weights.pth")
    with TestClient(create_app(s)) as c:
        yield c
