
# Raw Data Directory

This directory contains raw, unprocessed data used by the Astra-Grid system.

## Data Sources

### 1. Open Power System Data
- **Source**: https://open-power-system-data.org/
- **Format**: CSV
- **Description**: Historical power system data for training
- **Files**: `opsd_time_series_*.csv`

### 2. AI4I 2020 Predictive Maintenance Dataset
- **Source**: https://archive.ics.uci.edu/ml/datasets/AI4I+2020+Predictive+Maintenance+Dataset
- **Format**: CSV
- **Description**: Machine failure data for predictive models
- **Files**: `ai4i2020.csv`

### 3. Infrastructure Scans
- **Source**: D-Robotics RDK X5
- **Format**: JSON
- **Description**: Raw scan data from physical infrastructure
- **Files**: `scans/SCAN-*.json`

### 4. OCR Training Data
- **Source**: Industrial imagery
- **Format**: Images (PNG, JPG) + Labels (JSON)
- **Description**: Analog gauges, serial plates, schematics
- **Files**: `ocr_images/`, `ocr_labels/`

## Usage

Download datasets:
```bash
cd data/raw
wget https://data.open-power-system-data.org/time_series/2020-10-06/time_series_60min_singleindex.csv
wget https://archive.ics.uci.edu/ml/machine-learning-databases/00601/ai4i2020.csv
```

## Data Format

### Scan Data Example
```json
{
  "scan_id": "SCAN-B4-SECTOR-01-20240101120000",
  "sector": "B4-SECTOR-01",
  "timestamp": "2024-01-01T12:00:00Z",
  "components": [
    {
      "component_id": "B4-SECTOR-01-COMP-001",
      "ocr_text": "Normal",
      "confidence": 0.95,
      "image_path": "images/comp_001.jpg"
    }
  ]
}
```
