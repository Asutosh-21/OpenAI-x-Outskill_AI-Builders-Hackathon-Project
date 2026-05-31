import json
from functools import lru_cache
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
LOCAL_DATA_DIR = ROOT / "data"
DEPLOY_DATA_DIR = Path(__file__).resolve().parents[1] / "data"
DATA_DIR = LOCAL_DATA_DIR if LOCAL_DATA_DIR.exists() else DEPLOY_DATA_DIR

# Map of data file names to their subdirectory paths
DATA_FILE_PATHS = {
    "inventory.json": "inventory/inventory.json",
    "ads.json": "ads/ads.json",
    "returns.json": "returns/returns.json",
    "alerts.json": "alerts/alerts.json",
    "catalog.json": "catalog/catalog.json",
    "products.json": "catalog/products.json",
    "marketplace_data.json": "marketplaces/marketplace_data.json",
}


@lru_cache(maxsize=16)
def load_json(name: str) -> Any:
    """Load JSON data from the data directory with subdirectory support"""
    # Use mapped path if available, otherwise use direct path
    file_path = DATA_FILE_PATHS.get(name, name)
    full_path = DATA_DIR / file_path
    
    with full_path.open("r", encoding="utf-8") as file:
        return json.load(file)
