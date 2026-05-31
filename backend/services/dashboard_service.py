from agents.ad_agent import ad_recommendations
from agents.inventory_agent import inventory_risks
from agents.pooling_agent import pooling_recommendations
from agents.returns_agent import returns_audit
from services.alert_service import alerts


def dashboard_summary() -> dict:
    inventory = inventory_risks()
    ads = ad_recommendations()
    returns = returns_audit()
    pooling = pooling_recommendations()
    active_alerts = alerts()

    ad_waste = sum(row["daily_spend_inr"] for row in ads if row["risk_score"] >= 55)
    margin_leakage = sum(row["payout_gap_inr"] for row in returns if row["risk_score"] >= 35)

    return {
        "kpis": {
            "revenue_at_risk_inr": 452000,
            "ad_waste_inr_per_day": ad_waste,
            "critical_stockouts": len([row for row in inventory if row["severity"] in {"critical", "high"}]),
            "returns_leakage_inr": margin_leakage,
            "ai_actions": len(active_alerts) + len(pooling),
            "sku_health": 72,
        },
        "hero_insight": inventory[0],
        "top_ad_alert": ads[0],
        "top_return_alert": returns[0],
        "pooling": pooling,
        "alerts": active_alerts,
        "trend": [
            {"day": "Mon", "stockoutRisk": 72, "adWaste": 36, "fillRate": 81},
            {"day": "Tue", "stockoutRisk": 68, "adWaste": 42, "fillRate": 84},
            {"day": "Wed", "stockoutRisk": 76, "adWaste": 49, "fillRate": 78},
            {"day": "Thu", "stockoutRisk": 91, "adWaste": 63, "fillRate": 73},
            {"day": "Fri", "stockoutRisk": 82, "adWaste": 55, "fillRate": 79},
            {"day": "Sat", "stockoutRisk": 64, "adWaste": 38, "fillRate": 86},
            {"day": "Sun", "stockoutRisk": 58, "adWaste": 32, "fillRate": 89}
        ],
    }
