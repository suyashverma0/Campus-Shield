import io

import pytest
from PIL import Image

from app.services.image_validation import ImageValidationError, load_and_validate_image
from tests.conftest import make_image

KW = dict(max_bytes=200_000, max_pixels=1_000_000, min_side=32)


def load(data, **over):
    return load_and_validate_image(data, **{**KW, **over})


@pytest.mark.parametrize("fmt", ["PNG", "JPEG", "WEBP"])
def test_valid_formats_return_rgb(fmt):
    assert load(make_image(1, fmt=fmt)).mode == "RGB"


def test_rgba_is_flattened_to_rgb():
    buf = io.BytesIO()
    Image.new("RGBA", (64, 64), (255, 0, 0, 0)).save(buf, "PNG")
    img = load(buf.getvalue())
    assert img.mode == "RGB" and img.getpixel((0, 0)) == (255, 255, 255)


def _err(data, **over):
    with pytest.raises(ImageValidationError) as e:
        load(data, **over)
    return e.value.status_code


def test_empty_file():
    assert _err(b"") == 400


def test_not_an_image():
    assert _err(b"hello, I am text") == 415


def test_unsupported_format_gif():
    buf = io.BytesIO(); Image.new("RGB", (64, 64)).save(buf, "GIF")
    assert _err(buf.getvalue()) == 415


def test_too_many_bytes():
    assert _err(make_image(2), max_bytes=100) == 413


def test_too_many_pixels():
    assert _err(make_image(2, size=(200, 200)), max_pixels=1000) == 413


def test_too_small():
    assert _err(make_image(2, size=(16, 16))) == 400


def test_truncated_png():
    data = make_image(3, size=(300, 300))
    assert _err(data[: len(data) // 2]) == 400
