from utils.data_loader import load_json


def returns_audit() -> list[dict]:
    rows = []
    for item in load_json("returns.json"):
        payout_gap = item["payout_expected_inr"] - item["payout_received_inr"]
        condition_penalty = 30 if item["condition"] in {"accessory_missing", "unusable"} else 12
        inventory_penalty = 24 if not item["inventory_updated"] else 0
        score = min(99, condition_penalty + inventory_penalty + round((payout_gap / max(item["refund_inr"], 1)) * 45))
        severity = "critical" if score >= 75 else "high" if score >= 50 else "medium" if score >= 25 else "low"
        rows.append(
            {
                **item,
                "payout_gap_inr": payout_gap,
                "risk_score": score,
                "severity": severity,
                "reason": f"{item['reason']} with ₹{payout_gap:,} payout gap and inventory_updated={item['inventory_updated']}.",
                "expected_impact": "Recover leakage and improve return accountability.",
                "suggested_action": "Create dispute ticket" if score >= 50 else "Monitor return closure",
            }
        )
    return sorted(rows, key=lambda row: row["risk_score"], reverse=True)
