"""ResNet50 feature extractor (inference only, pooled 2048-d embedding)."""
from __future__ import annotations

from pathlib import Path

import numpy as np
import torch
from PIL import Image
from torchvision import transforms
from torchvision.models import ResNet50_Weights, resnet50

from app.services.similarity import l2_normalize

PIPELINE_VERSION = "v1"  # bump when preprocessing/pooling changes so stored embeddings get refreshed


class ModelLoadError(RuntimeError):
    pass


class FeatureExtractor:
    """Same model + preprocessing for lost and found images.

    The classification head (`fc`) is replaced with Identity, so the forward pass returns the
    global-average-pooled 2048-d feature vector. Returned embeddings are L2-normalised.
    """

    embedding_dim = 2048

    def __init__(self, weights: str = "imagenet", device: str = "cpu"):
        self.device = torch.device(device)
        self.weights_spec = weights
        try:
            model, tag, preprocess = self._build(weights)
        except Exception as exc:  # network failure, bad file, ...
            raise ModelLoadError(f"Could not load ResNet50 weights '{weights}': {exc}") from exc
        model.fc = torch.nn.Identity()
        self.model = model.eval().to(self.device)
        self.preprocess = preprocess
        self.model_version = f"resnet50-{tag}-{PIPELINE_VERSION}"

    @staticmethod
    def _build(weights: str):
        if weights == "imagenet":
            w = ResNet50_Weights.IMAGENET1K_V2
            return resnet50(weights=w), "imagenet", w.transforms()  # resize 232 -> crop 224 -> normalise
        manual = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ])
        if weights == "none":
            return resnet50(weights=None), "random-init", manual
        path = Path(weights)
        if not path.is_file():
            raise FileNotFoundError(f"weights file not found: {path}")
        model = resnet50(weights=None)
        model.load_state_dict(torch.load(path, map_location="cpu", weights_only=True))
        return model, f"custom-{path.stem}", manual

    @torch.inference_mode()
    def extract_batch(self, images: list[Image.Image]) -> np.ndarray:
        batch = torch.stack([self.preprocess(im) for im in images]).to(self.device)
        feats = self.model(batch).float().cpu().numpy().astype(np.float64)
        return np.vstack([l2_normalize(f) for f in feats]).astype(np.float32)

    def extract(self, image: Image.Image) -> np.ndarray:
        return self.extract_batch([image])[0]
