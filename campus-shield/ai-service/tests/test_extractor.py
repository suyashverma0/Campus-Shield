import io

import numpy as np
from PIL import Image

from tests.conftest import make_image


def img(seed):
    return Image.open(io.BytesIO(make_image(seed))).convert("RGB")


def test_embedding_shape_dtype_and_unit_norm(extractor):
    e = extractor.extract(img(1))
    assert e.shape == (2048,) and e.dtype == np.float32
    assert np.linalg.norm(e) == np.float32(1.0) or abs(np.linalg.norm(e) - 1) < 1e-5


def test_deterministic(extractor):
    assert np.array_equal(extractor.extract(img(1)), extractor.extract(img(1)))


def test_batch_matches_single(extractor):
    b = extractor.extract_batch([img(1), img(2)])
    assert np.allclose(b[0], extractor.extract(img(1)), atol=1e-5)
    assert np.allclose(b[1], extractor.extract(img(2)), atol=1e-5)


def test_different_images_differ(extractor):
    assert not np.allclose(extractor.extract(img(1)), extractor.extract(img(2)))


def test_model_version_flags_random_weights(extractor):
    assert "random-init" in extractor.model_version
