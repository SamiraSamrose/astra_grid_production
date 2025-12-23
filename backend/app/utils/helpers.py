
import hashlib
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
import json
import re

def generate_uuid() -> str:
    """Generate unique identifier"""
    return str(uuid.uuid4())

def generate_scan_id(sector: str) -> str:
    """Generate scan ID based on sector and timestamp"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"SCAN-{sector}-{timestamp}"

def generate_component_id(sector: str, index: int) -> str:
    """Generate component ID"""
    return f"{sector}-COMP-{index:03d}"

def calculate_hash(data: str) -> str:
    """Calculate SHA256 hash of data"""
    return hashlib.sha256(data.encode()).hexdigest()

def format_timestamp(dt: datetime) -> str:
    """Format datetime to ISO string"""
    return dt.isoformat()

def parse_timestamp(timestamp_str: str) -> datetime:
    """Parse ISO timestamp string"""
    return datetime.fromisoformat(timestamp_str)

def calculate_uptime_percentage(total_hours: float, downtime_hours: float) -> float:
    """Calculate uptime percentage"""
    if total_hours == 0:
        return 0.0
    return ((total_hours - downtime_hours) / total_hours) * 100

def format_bytes(bytes_value: int) -> str:
    """Format bytes to human-readable string"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_value < 1024.0:
            return f"{bytes_value:.2f} {unit}"
        bytes_value /= 1024.0
    return f"{bytes_value:.2f} PB"

def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    filename = re.sub(r'[^\w\s.-]', '', filename)
    filename = re.sub(r'[-\s]+', '-', filename)
    return filename.strip('-')

def paginate_results(items: List[Any], page: int = 1, page_size: int = 20) -> Dict:
    """Paginate list of items"""
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    
    return {
        'items': items[start_idx:end_idx],
        'page': page,
        'page_size': page_size,
        'total_items': len(items),
        'total_pages': (len(items) + page_size - 1) // page_size
    }

def calculate_risk_level(risk_score: float) -> str:
    """Calculate risk level from score"""
    if risk_score >= 0.7:
        return "Critical"
    elif risk_score >= 0.4:
        return "Warning"
    else:
        return "Stable"

def validate_sector_format(sector: str) -> bool:
    """Validate sector ID format"""
    pattern = r'^[A-Z]\d+-SECTOR-\d{2}$'
    return bool(re.match(pattern, sector))

def calculate_time_to_failure(risk_score: float) -> Optional[float]:
    """Calculate estimated time to failure in hours"""
    if risk_score >= 0.7:
        return 48.0
    elif risk_score >= 0.4:
        return 168.0
    return None

def merge_dicts(dict1: Dict, dict2: Dict) -> Dict:
    """Deep merge two dictionaries"""
    result = dict1.copy()
    for key, value in dict2.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = merge_dicts(result[key], value)
        else:
            result[key] = value
    return result

def calculate_percentage_change(old_value: float, new_value: float) -> float:
    """Calculate percentage change between two values"""
    if old_value == 0:
        return 0.0
    return ((new_value - old_value) / old_value) * 100

def round_to_decimals(value: float, decimals: int = 2) -> float:
    """Round float to specified decimal places"""
    return round(value, decimals)

def convert_celsius_to_fahrenheit(celsius: float) -> float:
    """Convert Celsius to Fahrenheit"""
    return (celsius * 9/5) + 32

def convert_fahrenheit_to_celsius(fahrenheit: float) -> float:
    """Convert Fahrenheit to Celsius"""
    return (fahrenheit - 32) * 5/9

def is_within_threshold(value: float, target: float, threshold: float) -> bool:
    """Check if value is within threshold of target"""
    return abs(value - target) <= threshold

def calculate_average(values: List[float]) -> float:
    """Calculate average of list of values"""
    if not values:
        return 0.0
    return sum(values) / len(values)

def calculate_standard_deviation(values: List[float]) -> float:
    """Calculate standard deviation"""
    if len(values) < 2:
        return 0.0
    
    mean = calculate_average(values)
    variance = sum((x - mean) ** 2 for x in values) / len(values)
    return variance ** 0.5

def format_duration(seconds: float) -> str:
    """Format duration in seconds to human-readable string"""
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        return f"{seconds/60:.1f}m"
    elif seconds < 86400:
        return f"{seconds/3600:.1f}h"
    else:
        return f"{seconds/86400:.1f}d"

def chunk_list(items: List[Any], chunk_size: int) -> List[List[Any]]:
    """Split list into chunks"""
    return [items[i:i + chunk_size] for i in range(0, len(items), chunk_size)]

def flatten_list(nested_list: List[List[Any]]) -> List[Any]:
    """Flatten nested list"""
    return [item for sublist in nested_list for item in sublist]

def remove_duplicates(items: List[Any]) -> List[Any]:
    """Remove duplicates while preserving order"""
    seen = set()
    result = []
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    """Safely divide two numbers"""
    if denominator == 0:
        return default
    return numerator / denominator

def clamp(value: float, min_value: float, max_value: float) -> float:
    """Clamp value between min and max"""
    return max(min_value, min(max_value, value))

def exponential_backoff(attempt: int, base_delay: float = 1.0, max_delay: float = 60.0) -> float:
    """Calculate exponential backoff delay"""
    delay = min(base_delay * (2 ** attempt), max_delay)
    return delay
