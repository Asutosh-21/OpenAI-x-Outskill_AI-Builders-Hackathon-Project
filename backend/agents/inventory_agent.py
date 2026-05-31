from math import ceil

from utils.data_loader import load_json


def _risk_score(item: dict) -> tuple[int, float]:
    adjusted_sales = max(item["hourly_sales"] * item["trend_index"], 1)
    hours_to_stockout = item["inventory_units"] / adjusted_sales
    cover_gap = max(item["safety_stock"] - item["inventory_units"], 0) / max(item["safety_stock"], 1)
    lead_time_pressure = max(item["lead_time_hours"] - hours_to_stockout, 0) / max(item["lead_time_hours"], 1)
    trend_pressure = max(item["trend_index"] - 1, 0) * 22
    score = min(99, round((cover_gap * 46) + (lead_time_pressure * 38) + trend_pressure))
    return score, hours_to_stockout


def inventory_risks() -> list[dict]:
    rows = []
    for item in load_json("inventory.json"):
        score, hours = _risk_score(item)
        severity = "critical" if score >= 75 else "high" if score >= 55 else "medium" if score >= 32 else "low"
        replenish_units = max(item["safety_stock"] * 2 - item["inventory_units"], 0)
        rows.append(
            {
                **item,
                "risk_score": score,
                "severity": severity,
                "hours_to_stockout": round(hours, 1),
                "recommended_units": int(ceil(replenish_units / 10) * 10),
                "reason": f"{item['platform']} {item['dark_store']} has {round(hours, 1)} hours of cover after trend adjustment.",
                "expected_impact": "Avoid lost sales and protect marketplace ranking.",
                "suggested_action": f"Replenish {int(ceil(replenish_units / 10) * 10)} units and review safety stock.",
            }
        )
    return sorted(rows, key=lambda row: row["risk_score"], reverse=True)
