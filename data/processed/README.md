
# Processed Data Directory

This directory contains preprocessed and cleaned data ready for model training and inference.

## Data Files

### 1. Training Datasets
- `structural_reasoning_train.jsonl` - Unsloth training data
- `technical_veracity_train.jsonl` - LLaMA-Factory training data
- `ocr_completion_train.jsonl` - PaddleOCR training data

### 2. Validation Datasets
- `structural_reasoning_val.jsonl` - Validation set
- `technical_veracity_val.jsonl` - Validation set
- `ocr_completion_val.jsonl` - Validation set

### 3. Component Registry
- `component_registry.parquet` - All component metadata
- `component_telemetry.parquet` - Historical telemetry data

### 4. Failure Patterns
- `failure_patterns.csv` - Analyzed failure patterns
- `risk_scores.csv` - Component risk scores

## Data Processing

Process raw data:
```bash
python scripts/process_data.py --input data/raw --output data/processed
```

## Format Examples

### Training Data (JSONL)
```json
{"instruction": "Analyze the following electrical schematic...", "input": "Component status: Normal, Temperature: 45.2°C", "response": "Risk score: 0.15, Category: Stable"}
```

### Component Registry (Parquet)
| component_id | sector | type | serial | last_scanned |
|-------------|--------|------|--------|--------------|
| B4-SECTOR-01-COMP-001 | B4-SECTOR-01 | PSU | SN-12345 | 2024-01-01T12:00:00Z |
