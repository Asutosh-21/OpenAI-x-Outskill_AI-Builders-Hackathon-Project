from utils.data_loader import load_json


def alerts() -> list[dict]:
    order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    return sorted(load_json("alerts.json"), key=lambda row: order.get(row["severity"], 9))
