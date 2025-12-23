
import pytest
import numpy as np
from app.ml.unsloth_model import UnslothModel
from app.ml.llamafactory_model import LLaMAFactoryModel
from app.ml.paddle_ocr_model import PaddleOCRModel
from app.ml.failure_predictor import FailurePredictor

def test_unsloth_model_init():
    model = UnslothModel()
    assert model.model_path is not None

def test_llamafactory_model_init():
    model = LLaMAFactoryModel()
    assert len(model.safety_standards) > 0

def test_paddle_ocr_model_init():
    model = PaddleOCRModel()
    assert model.confidence_threshold == 0.85

def test_failure_predictor_init():
    predictor = FailurePredictor()
    assert predictor.model is None

def test_paddle_ocr_simulate():
    model = PaddleOCRModel()
    image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
    result = model._simulate_ocr(image)
    assert "extracted_text" in result
    assert result["confidence"] > 0.8
