from collections import defaultdict

from agents.inventory_agent import inventory_risks


def pooling_recommendations() -> list[dict]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for row in inventory_risks():
        grouped[row["sku"]].append(row)

    recommendations = []
    for sku, rows in grouped.items():
        high_risk = [row for row in rows if row["risk_score"] >= 55]
        excess = [row for row in rows if row["inventory_units"] > row["safety_stock"] * 1.5]
        for target in high_risk:
            source = next((row for row in excess if row["platform"] != target["platform"]), None)
            if not source:
                continue
            transfer_units = min(30, max(source["inventory_units"] - source["safety_stock"], 0))
            recommendations.append(
                {
                    "sku": sku,
                    "product": target["product"],
                    "from_platform": source["platform"],
                    "from_location": source["dark_store"],
                    "to_platform": target["platform"],
                    "to_location": target["dark_store"],
                    "transfer_units": transfer_units,
                    "severity": "high" if target["risk_score"] >= 75 else "medium",
                    "risk_score": target["risk_score"],
                    "reason": f"{source['platform']} has excess stock while {target['platform']} is at risk.",
                    "expected_impact": "Capture demand without waiting for fresh procurement.",
                    "suggested_action": f"Transfer {transfer_units} units to {target['platform']} {target['dark_store']}.",
                }
            )
    return recommendations
