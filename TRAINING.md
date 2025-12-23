Model Training Guide
Training Infrastructure

## Hardware Requirements

- GPU: NVIDIA A100/H100 or Google TPU v5p
- RAM: 64GB+
- Storage: 500GB+ SSD

## Software Requirements

- Python 3.11+
- CUDA 12.1+ (for NVIDIA GPUs)
- PyTorch 2.1+
- Transformers 4.35+

## Training Datasets

1. Open Power System Data

pythonimport pandas as pd

url = "https://data.open-power-system-data.org/time_series/2020-10-06/time_series_60min_singleindex.csv"

opsd_data = pd.read_csv(url)

2. AI4I 2020 Predictive Maintenance

pythonurl = "https://archive.ics.uci.edu/ml/machine-learning-databases/00601/ai4i2020.csv"

ai4i_data = pd.read_csv(url)

## Fine-Tuning Strategies

Tier 1: Unsloth (Structural Reasoning)
bashpython scripts/train_models.py \
  --model unsloth \
  --base-model ERNIE-4.5-21B \
  --dataset opsd \
  --lora-rank 64 \
  --lora-alpha 128 \
  --quantization 4bit \
  --epochs 3 \
  --batch-size 16 \
  --learning-rate 2e-4

Tier 2: LLaMA-Factory (Technical Veracity)
bashpython scripts/train_models.py \
  --model llamafactory \
  --base-model ERNIE-4.5-21B \
  --dataset technical \
  --stages 3 \
  --flash-attention \
  --prompt-masking

Tier 3: PaddleOCR-VL (Completion-Only)
bashpython scripts/train_models.py \
  --model paddleocr \
  --dataset industrial-images \
  --iterations 50 \
  --weathering-aug

## Hyperparameters
- ParameterValueLoRA Rank (r)64LoRA Alpha128Quantization4-bitLearning Rate2e-4Batch Size16Weight Decay0.01SchedulerCosineNEFTune Alpha5.0

## Training Techniques

- NEFTune (Noisy Embeddings)
- Adds noise to embeddings during training for robustness:
- pythonembedding += torch.randn_like(embedding) * neftune_alpha
- Flash Attention 2
- Enables 2-4x speedup and 32k token context:

pythonmodel = AutoModel.from_pretrained(
    model_name,
    use_flash_attention_2=True
)

## Prompt Masking

Masks prompt loss during SFT:
pythonloss_mask = torch.where(
    input_ids == prompt_ids,
    0.0,
    1.0
)

## Monitoring Training

pythonimport wandb

wandb.init(project="astra-grid")
wandb.log({
    "train_loss": loss.item(),
    "learning_rate": scheduler.get_last_lr()[0]
})

## Model Export

python# Save LoRA weights
model.save_pretrained("./models/weights/astra-grid-lora")

# Merge and save
merged_model = model.merge_and_unload()
merged_model.save_pretrained("./models/weights/astra-grid-merged")
Upload to HuggingFace
bashhuggingface-cli login
huggingface-cli upload your-username/astra-grid-ernie-4.5-lora ./models/weights/
