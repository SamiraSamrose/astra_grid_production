
Astra-Grid Model Weights
This directory contains fine-tuned model weights for the Astra-Grid system.
Models
1. Unsloth Fine-tuned ERNIE 4.5

Path: ./astra-grid-unsloth/
Type: 4-bit QLoRA
Task: Structural reasoning for grid layouts
Dataset: Open Power System Data
LoRA Rank: 64
LoRA Alpha: 128

2. LLaMA-Factory Fine-tuned ERNIE 4.5

Path: ./astra-grid-llamafactory/
Type: Multi-stage SFT
Task: Technical veracity and compliance
Dataset: IEEE/OSHA standards
Flash Attention: Enabled
Context Window: 32k tokens

3. PaddleOCR-VL Fine-tuned

Path: ./paddleocr-vl/
Type: Completion-only training
Task: Industrial OCR
Specialization: Weather-worn dials, rusted plates
Confidence Threshold: 85%

Download
Download pre-trained weights from:

HuggingFace: https://huggingface.co/samirasamrose/astra-grid-ernie-4.5-lora
GitHub Releases: https://github.com/samirasamrose/astra-grid-infrastructure-audit/releases

Usage
pythonfrom app.ml.unsloth_model import UnslothModel

model = UnslothModel(model_path="./models/weights/astra-grid-unsloth")
model.load_model()
result = model.predict_failure(component_data)
Training
To train models from scratch:
bashpython scripts/train_models.py --model unsloth --config models/configs/unsloth_config.yaml
License
Apache 2.0
