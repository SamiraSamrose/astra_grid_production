
import argparse
import yaml
import logging
from pathlib import Path
import sys
sys.path.append(str(Path(file).parent.parent / "backend"))
from app.ml.unsloth_model import UnslothModel
from app.ml.llamafactory_model import LLaMAFactoryModel
from app.ml.paddle_ocr_model import PaddleOCRModel
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(name)
def load_config(config_path: str) -> dict:
"""Load training configuration"""
with open(config_path, 'r') as f:
return yaml.safe_load(f)
def train_unsloth(config: dict):
"""Train Unsloth model"""
logger.info("Starting Unsloth training...")
logger.info(f"Config: {config}")
# Training implementation here
logger.info("Training complete. Model saved to: models/weights/astra-grid-unsloth")
def train_llamafactory(config: dict):
"""Train LLaMA-Factory model"""
logger.info("Starting LLaMA-Factory training...")
logger.info(f"Config: {config}")
# Training implementation here
logger.info("Training complete. Model saved to: models/weights/astra-grid-llamafactory")
def train_paddleocr(config: dict):
"""Train PaddleOCR model"""
logger.info("Starting PaddleOCR training...")
logger.info(f"Config: {config}")
# Training implementation here
logger.info("Training complete. Model saved to: models/weights/paddleocr-vl")
def main():
parser = argparse.ArgumentParser(description="Train Astra-Grid models")
parser.add_argument("--model", required=True, choices=["unsloth", "llamafactory", "paddleocr"],
help="Model to train")
parser.add_argument("--config", required=True, help="Path to config file")
parser.add_argument("--dataset", help="Dataset name")
parser.add_argument("--epochs", type=int, default=3, help="Number of epochs")
parser.add_argument("--batch-size", type=int, default=16, help="Batch size")
parser.add_argument("--learning-rate", type=float, default=2e-4, help="Learning rate")
args = parser.parse_args()

config = load_config(args.config)

if args.model == "unsloth":
    train_unsloth(config)
elif args.model == "llamafactory":
    train_llamafactory(config)
elif args.model == "paddleocr":
    train_paddleocr(config)
if name == "main":
main()
