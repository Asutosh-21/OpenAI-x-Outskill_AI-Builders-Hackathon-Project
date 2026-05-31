from agents.inventory_agent import inventory_risks
from utils.data_loader import load_json


def ad_recommendations() -> list[dict]:
    risks = {(row["sku"], row["platform"]): row for row in inventory_risks()}
    recommendations = []
    for ad in load_json("ads.json"):
        risk = risks.get((ad["sku"], ad["platform"]))
        risk_score = risk["risk_score"] if risk else 0
        waste_score = min(99, round((risk_score * 0.68) + (max(2.8 - ad["roas"], 0) * 12)))
        severity = "critical" if waste_score >= 75 else "high" if waste_score >= 55 else "medium" if waste_score >= 35 else "low"
        action = "Pause campaign" if waste_score >= 70 else "Reduce bid and cap budget" if waste_score >= 45 else "Keep active"
        recommendations.append(
            {
                **ad,
                "risk_score": waste_score,
                "severity": severity,
                "reason": f"{ad['campaign']} is spending ₹{ad['daily_spend_inr']:,}/day while shelf risk is {risk_score}.",
                "expected_impact": "Reduce wasted spend and redirect demand toward available inventory.",
                "suggested_action": action,
            }
        )
    return sorted(recommendations, key=lambda row: row["risk_score"], reverse=True)
