"""Runtime configuration. Every value can be overridden with a CS_* environment variable."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="CS_", env_file=".env", extra="ignore", protected_namespaces=("settings_",)
    )

    # "imagenet"  -> torchvision ResNet50 IMAGENET1K_V2 weights (downloaded on first use)
    # "none"      -> architecture only, random weights (tests / plumbing checks ONLY)
    # <path>      -> a local .pth state_dict (e.g. a fine-tuned model)
    model_weights: str = "imagenet"
    device: str = "cpu"

    max_image_bytes: int = 5 * 1024 * 1024
    max_image_pixels: int = 40_000_000
    min_image_side: int = 32

    max_compare_candidates: int = 20      # candidate images per /compare call
    max_match_candidates: int = 2000      # candidate embeddings per /match call
    max_json_body_bytes: int = 64 * 1024 * 1024
    max_top_k: int = 100
    default_top_k: int = 5

    # No default threshold on purpose: choose one from evaluation data (scripts/evaluate.py).
    default_threshold: float | None = None
