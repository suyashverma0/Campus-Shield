"""Validate and normalise uploaded images before they reach the CNN."""
from __future__ import annotations

import io

from PIL import Image, ImageOps, UnidentifiedImageError

ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}


class ImageValidationError(Exception):
    def __init__(self, status_code: int, message: str):
        super().__init__(message)
        self.status_code = status_code
        self.message = message


def load_and_validate_image(
    data: bytes, *, max_bytes: int, max_pixels: int, min_side: int
) -> Image.Image:
    """Return an RGB PIL image or raise ImageValidationError with an HTTP-style status."""
    if not data:
        raise ImageValidationError(400, "Uploaded file is empty.")
    if len(data) > max_bytes:
        raise ImageValidationError(413, f"Image exceeds the {max_bytes // 1024} KB size limit.")

    try:
        probe = Image.open(io.BytesIO(data))
        fmt, (w, h) = probe.format, probe.size
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        raise ImageValidationError(415, "File is not a readable image (JPEG, PNG or WEBP required).")

    if fmt not in ALLOWED_FORMATS:
        raise ImageValidationError(415, f"Unsupported image format '{fmt}'. Use JPEG, PNG or WEBP.")
    if w * h > max_pixels:
        raise ImageValidationError(413, f"Image dimensions {w}x{h} are too large.")
    if min(w, h) < min_side:
        raise ImageValidationError(400, f"Image is too small ({w}x{h}); minimum side is {min_side}px.")

    try:
        probe.verify()                       # detects many corrupt files
        img = Image.open(io.BytesIO(data))   # verify() invalidates the handle; reopen
        img.load()                           # detects truncated data
    except (OSError, SyntaxError, ValueError, Image.DecompressionBombError):
        raise ImageValidationError(400, "Image file is corrupt or truncated.")

    img = ImageOps.exif_transpose(img)
    if img.mode in ("RGBA", "LA", "P"):
        rgba = img.convert("RGBA")
        bg = Image.new("RGB", rgba.size, (255, 255, 255))
        bg.paste(rgba, mask=rgba.split()[3])
        return bg
    return img.convert("RGB")
