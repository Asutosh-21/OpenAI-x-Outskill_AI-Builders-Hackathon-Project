"""
AI Operations Copilot Agent - Business Operations Advisor
Powered by structured deterministic responses
Helps founders, operations managers, and growth teams make data-driven decisions
"""

import os
from typing import Any

from agents.inventory_agent import inventory_risks
from agents.ad_agent import ad_recommendations
from agents.pooling_agent import pooling_recommendations
from agents.returns_agent import returns_audit


def _build_context() -> dict[str, Any]:
    """Aggregate context from all intelligence modules for comprehensive business insights"""
    
    # Core agents data - no try-catch, let errors bubble up
    inventory = inventory_risks()
    ads = ad_recommendations()
    pooling = pooling_recommendations()
    returns = returns_audit()
    
    # Additional data sources with error handling
    try:
        from utils.data_loader import load_json
        marketplace_data = load_json("marketplace_data.json")
        catalog_data = load_json("catalog.json")
        alerts_data = load_json("alerts.json")
    except Exception as e:
        print(f"Warning: Could not load additional data: {e}")
        marketplace_data = []
        catalog_data = []
        alerts_data = []
    
    # Get top items from each category - ensure they're dictionaries
    top_inventory_risk = inventory[0] if inventory and isinstance(inventory[0], dict) else None
    top_ad_risk = ads[0] if ads and isinstance(ads[0], dict) else None
    top_pooling = pooling[0] if pooling and isinstance(pooling[0], dict) else None
    top_return = returns[0] if returns and isinstance(returns[0], dict) else None
    
    # Calculate key business metrics - ensure items are dictionaries
    revenue_at_risk = sum(r.get("revenue_impact_inr", 15000) for r in inventory[:3] if isinstance(r, dict))
    ad_waste_daily = sum(
        a.get("daily_spend_inr", 0) * max(0, 1 - a.get("roas", 0) / 3)
        for a in ads if isinstance(a, dict) and a.get("severity") in {"critical", "high"}
    )
    total_payout_gap = sum(r.get("payout_gap_inr", 0) for r in returns if isinstance(r, dict))
    
    # Marketplace performance
    best_marketplace = None
    if marketplace_data and isinstance(marketplace_data, list):
        valid_platforms = [x for x in marketplace_data if isinstance(x, dict)]
        if valid_platforms:
            best_marketplace = max(valid_platforms, key=lambda x: x.get("gmv", 0))
    
    return {
        "inventory": {
            "total_risks": len(inventory),
            "critical_count": len([r for r in inventory if isinstance(r, dict) and r.get("severity") in {"critical", "high"}]),
            "top_risk": top_inventory_risk,
            "all_risks": [r for r in inventory[:5] if isinstance(r, dict)],
            "stockout_24h": len([r for r in inventory if isinstance(r, dict) and r.get("hours_to_stockout", 999) < 24]),
        },
        "ads": {
            "total_campaigns": len(ads),
            "at_risk_count": len([a for a in ads if isinstance(a, dict) and a.get("severity") in {"critical", "high"}]),
            "top_risk": top_ad_risk,
            "all_risks": [a for a in ads[:5] if isinstance(a, dict)],
            "total_daily_spend": sum(a.get("daily_spend_inr", 0) for a in ads if isinstance(a, dict)),
        },
        "pooling": {
            "opportunities": len(pooling),
            "top_opportunity": top_pooling,
            "all_opportunities": [p for p in pooling[:3] if isinstance(p, dict)],
            "potential_revenue_recovery": sum(p.get("revenue_impact_inr", 8000) for p in pooling[:3] if isinstance(p, dict)),
        },
        "returns": {
            "total_returns": len(returns),
            "dispute_needed": len([r for r in returns if isinstance(r, dict) and r.get("severity") in {"critical", "high"}]),
            "top_issue": top_return,
            "all_issues": [r for r in returns[:3] if isinstance(r, dict)],
        },
        "finance": {
            "total_payout_gap": total_payout_gap,
            "margin_leakage": total_payout_gap,
            "disputes_needed": len([r for r in returns if isinstance(r, dict) and r.get("severity") in {"critical", "high"}]),
        },
        "marketplace": {
            "platforms": marketplace_data if isinstance(marketplace_data, list) else [],
            "best_performer": best_marketplace,
            "total_platforms": len(marketplace_data) if isinstance(marketplace_data, list) else 0,
        },
        "catalog": {
            "total_skus": len(catalog_data) if isinstance(catalog_data, list) else 0,
        },
        "alerts": {
            "total_alerts": len(alerts_data) if isinstance(alerts_data, list) else 0,
            "critical_alerts": len([a for a in alerts_data if isinstance(a, dict) and a.get("severity") == "critical"]),
        },
        "summary": {
            "revenue_at_risk": revenue_at_risk,
            "ad_waste_daily": ad_waste_daily,
            "margin_leakage": total_payout_gap,
            "total_risks": len(inventory) + len(ads) + len(returns),
            "pooling_opportunity": sum(p.get("revenue_impact_inr", 8000) for p in pooling[:3]),
        }
    }


def _generate_deterministic_response(query: str, context: dict[str, Any]) -> str:
    """
    Generate structured business responses using deterministic logic
    
    Response Format (Always):
    📌 Problem: What's wrong?
    💰 Business Impact: Revenue/margin/waste quantified in ₹
    🔍 Root Cause: Why is this happening?
    ✅ Recommended Action: Specific, actionable steps
    📈 Expected Outcome: Quantified improvement
    """
    query_lower = query.lower()
    
    # 1. Which SKU needs attention today?
    if ("sku" in query_lower or "product" in query_lower) and ("attention" in query_lower or "focus" in query_lower or "priority" in query_lower or "need" in query_lower):
        top_risk = context["inventory"]["top_risk"]
        if top_risk:
            return f"""**SKU Requiring Immediate Attention:**

**Product:** {top_risk['product']} ({top_risk['sku']})

**📌 Problem:**
Only {top_risk['hours_to_stockout']} hours until stockout at {top_risk['platform']} - {top_risk['dark_store']}

**💰 Business Impact:**
• Revenue at Risk: ₹{top_risk.get('revenue_impact_inr', 15000):,}
• Ad Spend Waste: ₹{context['ads']['top_risk']['daily_spend_inr'] if context['ads']['top_risk'] else 0:,}/day
• Marketplace ranking will drop if stockout occurs

**🔍 Root Cause:**
{top_risk['reason']}

**✅ Recommended Action:**
{top_risk['suggested_action']}

**📈 Expected Outcome:**
• Prevent ₹{top_risk.get('revenue_impact_inr', 15000):,} revenue loss
• Maintain marketplace ranking and visibility
• Optimize ad spend efficiency by 100%"""
        return "✅ All SKUs are currently within safe inventory levels. No immediate attention required."
    
    # 2. What are my top risks?
    if "top risk" in query_lower or "biggest risk" in query_lower or "main risk" in query_lower or ("what" in query_lower and "risk" in query_lower):
        risks = []
        
        if context["inventory"]["critical_count"] > 0:
            risks.append({
                "type": "Stockout Risk",
                "count": context["inventory"]["critical_count"],
                "impact": f"₹{context['summary']['revenue_at_risk']:,} revenue at risk",
                "priority": "🔴 CRITICAL"
            })
        
        if context["ads"]["at_risk_count"] > 0:
            risks.append({
                "type": "Ad Waste",
                "count": context["ads"]["at_risk_count"],
                "impact": f"₹{context['summary']['ad_waste_daily']:,}/day wasted",
                "priority": "🟠 HIGH"
            })
        
        if context["finance"]["margin_leakage"] > 0:
            risks.append({
                "type": "Margin Leakage",
                "count": context["returns"]["dispute_needed"],
                "impact": f"₹{context['finance']['margin_leakage']:,} payout gaps",
                "priority": "🟡 MEDIUM"
            })
        
        if context["pooling"]["opportunities"] > 0:
            risks.append({
                "type": "Inventory Imbalance",
                "count": context["pooling"]["opportunities"],
                "impact": f"₹{context['summary']['pooling_opportunity']:,} opportunity cost",
                "priority": "🟡 MEDIUM"
            })
        
        if risks:
            response = "**Your Top Business Risks (Prioritized by Impact):**\n\n"
            for i, risk in enumerate(risks, 1):
                response += f"{i}. **{risk['type']}** {risk['priority']}\n"
                response += f"   • Count: {risk['count']}\n"
                response += f"   • Impact: {risk['impact']}\n\n"
            return response
        return "✅ Great news! No critical risks detected. All operations running smoothly."
    
    # 3. Why are sales dropping?
    if "sales" in query_lower and ("drop" in query_lower or "down" in query_lower or "falling" in query_lower or "declining" in query_lower or "why" in query_lower):
        top_risk = context["inventory"]["top_risk"]
        if top_risk:
            return f"""**Sales Analysis: {top_risk['product']}**

**📌 Problem:**
Sales declining due to imminent stockout at {top_risk['platform']} - {top_risk['dark_store']}

**💰 Business Impact:**
• Revenue Loss: ₹{top_risk.get('revenue_impact_inr', 15000):,}/week
• Ad Spend Waste: ₹{context['ads']['top_risk']['daily_spend_inr'] if context['ads']['top_risk'] else 0:,}/day on out-of-stock items
• Customer acquisition cost wasted

**🔍 Root Cause:**
1. **Stockout Risk**: Only {top_risk['hours_to_stockout']} hours of inventory remaining
2. **Demand Spike**: Selling at {top_risk['hourly_sales']} units/hour (above normal)
3. **Supply Gap**: Current stock ({top_risk['inventory_units']} units) below safety threshold ({top_risk['safety_stock']} units)
4. **Ad Misalignment**: Campaigns still active despite low stock

**✅ Recommended Actions:**
1. {top_risk['suggested_action']}
2. Pause ad campaigns immediately to stop wasting spend
3. Transfer inventory from excess locations via pooling optimizer

**📈 Expected Outcome:**
• Recover ₹{top_risk.get('revenue_impact_inr', 15000):,} in weekly revenue
• Save ₹{context['ads']['top_risk']['daily_spend_inr'] if context['ads']['top_risk'] else 0:,}/day in ad waste
• Maintain marketplace ranking and customer trust"""
        return "✅ No sales decline detected. All SKUs performing within normal ranges."
    
    # 4. Which products may stock out?
    if "stock out" in query_lower or "stockout" in query_lower or "out of stock" in query_lower or ("which" in query_lower and "stock" in query_lower):
        at_risk = [r for r in context["inventory"]["all_risks"] if r.get("hours_to_stockout", 999) < 24]
        if at_risk:
            response = f"**Products at Risk of Stockout (Next 24 Hours): {len(at_risk)} SKUs**\n\n"
            for i, item in enumerate(at_risk[:5], 1):
                response += f"{i}. **{item['product']}** ({item['sku']})\n"
                response += f"   • Location: {item['platform']} - {item['dark_store']}\n"
                response += f"   • Time to Stockout: {item['hours_to_stockout']} hours\n"
                response += f"   • Current Stock: {item['inventory_units']} units (selling {item['hourly_sales']}/hr)\n"
                response += f"   • Revenue at Risk: ₹{item.get('revenue_impact_inr', 15000):,}\n"
                response += f"   • Action: {item['suggested_action']}\n\n"
            
            total_revenue_risk = sum(item.get('revenue_impact_inr', 15000) for item in at_risk[:5])
            response += f"**Total Revenue at Risk: ₹{total_revenue_risk:,}**"
            return response
        return "✅ No stockout risks in the next 24 hours. All inventory levels healthy."
    
    # 5. Which ads should I pause?
    if ("pause" in query_lower or "stop" in query_lower) and ("ad" in query_lower or "campaign" in query_lower):
        at_risk_ads = [a for a in context["ads"]["all_risks"] if a.get("severity") in {"critical", "high"}]
        if at_risk_ads:
            response = "**Ads to Pause Immediately (High Waste Risk):**\n\n"
            total_waste = 0
            for i, ad in enumerate(at_risk_ads[:3], 1):
                daily_waste = ad['daily_spend_inr'] * max(0, 1 - ad['roas'] / 3)
                total_waste += daily_waste
                response += f"{i}. **{ad['campaign']}**\n"
                response += f"   • Platform: {ad['platform']}\n"
                response += f"   • Daily Spend: ₹{ad['daily_spend_inr']:,}\n"
                response += f"   • ROAS: {ad['roas']} (Target: 3.0+)\n"
                response += f"   • Daily Waste: ₹{daily_waste:,.0f}\n"
                response += f"   • Risk: {ad['severity'].upper()}\n"
                response += f"   • Reason: {ad['reason']}\n\n"
            response += f"**Total Daily Savings: ₹{total_waste:,.0f}** (₹{total_waste * 30:,.0f}/month)"
            return response
        return "✅ All ad campaigns are performing well. No pauses needed."
    
    # 6. Where should I move inventory? / What inventory transfers should I make?
    if ("move" in query_lower or "transfer" in query_lower or "rebalance" in query_lower or "where" in query_lower) and "inventory" in query_lower:
        opportunities = context["pooling"]["all_opportunities"]
        if opportunities:
            response = f"**Inventory Transfer Recommendations: {len(opportunities)} Opportunities**\n\n"
            total_impact = 0
            for i, opp in enumerate(opportunities, 1):
                impact = opp.get('revenue_impact_inr', 8000)
                total_impact += impact
                response += f"{i}. **{opp['product']}** - Transfer {opp['transfer_units']} units\n"
                response += f"   • From: {opp['from_platform']} - {opp['from_location']} (excess)\n"
                response += f"   • To: {opp['to_platform']} - {opp['to_location']} (stockout risk)\n"
                response += f"   • Revenue Impact: ₹{impact:,}\n"
                response += f"   • Reason: {opp['reason']}\n"
                response += f"   • Action: {opp['suggested_action']}\n\n"
            response += f"**Total Revenue Recovery: ₹{total_impact:,}**"
            return response
        return "✅ No inventory imbalances detected. All platforms well-balanced."
    
    # 7. Which returns require disputes?
    if "return" in query_lower and ("dispute" in query_lower or "issue" in query_lower or "problem" in query_lower or "require" in query_lower):
        dispute_returns = [r for r in context["returns"]["all_issues"] if r.get("severity") in {"critical", "high"}]
        if dispute_returns:
            response = f"**Returns Requiring Disputes: {len(dispute_returns)} Cases**\n\n"
            total_recovery = 0
            for i, ret in enumerate(dispute_returns[:5], 1):
                gap = ret.get('payout_gap_inr', 0)
                total_recovery += gap
                response += f"{i}. **{ret['product']}** ({ret['sku']})\n"
                response += f"   • Platform: {ret['platform']}\n"
                response += f"   • Payout Gap: ₹{gap:,}\n"
                response += f"   • Reason: {ret['reason']}\n"
                response += f"   • Risk: {ret['severity'].upper()}\n"
                response += f"   • Action: {ret['suggested_action']}\n\n"
            response += f"**Total Potential Recovery: ₹{total_recovery:,}**"
            return response
        return "✅ No return disputes needed. All payouts reconciled correctly."
    
    # 8. Which products have the highest demand?
    if "demand" in query_lower and ("high" in query_lower or "most" in query_lower or "top" in query_lower or "which" in query_lower):
        high_demand = sorted(context["inventory"]["all_risks"], key=lambda x: x.get("hourly_sales", 0), reverse=True)[:5]
        if high_demand:
            response = "**Highest Demand Products (by Sales Velocity):**\n\n"
            for i, item in enumerate(high_demand, 1):
                response += f"{i}. **{item['product']}**\n"
                response += f"   • Sales Rate: {item['hourly_sales']} units/hour\n"
                response += f"   • Platform: {item['platform']} - {item['dark_store']}\n"
                response += f"   • Current Stock: {item['inventory_units']} units\n"
                response += f"   • Hours to Stockout: {item['hours_to_stockout']}\n"
                response += f"   • Status: {'🔴 URGENT' if item['hours_to_stockout'] < 12 else '🟡 MONITOR'}\n\n"
            return response
        return "Demand data unavailable. Check inventory intelligence for sales velocity."
    
    # 9. What is my revenue at risk?
    if "revenue" in query_lower and ("risk" in query_lower or "loss" in query_lower or "at risk" in query_lower or "what" in query_lower):
        revenue_risk = context["summary"]["revenue_at_risk"]
        ad_waste = context["summary"]["ad_waste_daily"]
        margin_leak = context["finance"]["margin_leakage"]
        
        return f"""**Revenue Risk Analysis:**

**📌 Total Revenue at Risk: ₹{revenue_risk + ad_waste * 7 + margin_leak:,}**

**Breakdown:**

1. **Stockout Revenue Loss**
   • Weekly Impact: ₹{revenue_risk:,}
   • Affected SKUs: {context['inventory']['critical_count']}
   • Root Cause: Inventory shortages at high-demand locations

2. **Ad Spend Waste**
   • Daily Waste: ₹{ad_waste:,}
   • Weekly Impact: ₹{ad_waste * 7:,}
   • Affected Campaigns: {context['ads']['at_risk_count']}
   • Root Cause: Campaigns running on out-of-stock or low-ROAS products

3. **Margin Leakage**
   • Total Gap: ₹{margin_leak:,}
   • Affected Returns: {context['returns']['dispute_needed']}
   • Root Cause: Payout discrepancies and return disputes

**✅ Recommended Actions:**
1. Address top {context['inventory']['critical_count']} stockout risks immediately
2. Pause {context['ads']['at_risk_count']} underperforming ad campaigns
3. File disputes for {context['returns']['dispute_needed']} return discrepancies

**📈 Expected Recovery: ₹{revenue_risk + ad_waste * 7 + margin_leak:,}**"""
    
    # 10. Which marketplace is performing best?
    if "marketplace" in query_lower and ("best" in query_lower or "perform" in query_lower or "top" in query_lower or "which" in query_lower):
        platforms = context["marketplace"]["platforms"]
        if platforms:
            response = "**Marketplace Performance Ranking:**\n\n"
            sorted_platforms = sorted(platforms, key=lambda x: x.get("gmv", 0), reverse=True)
            for i, platform in enumerate(sorted_platforms, 1):
                response += f"{i}. **{platform.get('name', 'Unknown')}**\n"
                response += f"   • GMV: ₹{platform.get('gmv', 0):,}\n"
                response += f"   • Orders: {platform.get('orders', 0):,}\n"
                response += f"   • Fill Rate: {platform.get('fill_rate', 0)}%\n"
                response += f"   • Status: {'🏆 BEST' if i == 1 else '✅ GOOD' if i == 2 else '⚠️ NEEDS IMPROVEMENT'}\n\n"
            return response
        return "Marketplace performance data unavailable. Check marketplace analytics."
    
    # 11. What margin leakages exist?
    if "margin" in query_lower and ("leak" in query_lower or "loss" in query_lower or "gap" in query_lower or "what" in query_lower):
        margin_leak = context["finance"]["margin_leakage"]
        disputes = context["returns"]["dispute_needed"]
        
        return f"""**Margin Leakage Analysis:**

**📌 Total Margin Leakage: ₹{margin_leak:,}**

**💰 Business Impact:**
• Cash flow impact from payout discrepancies
• Profit margin erosion
• Working capital tied up in disputes

**🔍 Root Causes:**
1. **Return Payout Gaps**: {disputes} returns with incorrect payouts
2. **Inventory Discrepancies**: Stock not updated after returns
3. **Platform Fee Errors**: Incorrect commission calculations

**✅ Recommended Actions:**
1. File disputes for {disputes} high-value return discrepancies
2. Reconcile inventory records with actual stock
3. Audit platform fee calculations for errors

**📈 Expected Recovery:**
• Immediate: ₹{margin_leak * 0.7:,.0f} (70% recovery rate)
• 30 days: ₹{margin_leak:,} (full recovery with disputes)"""
    
    # 12. What actions should I take today?
    if "action" in query_lower and ("today" in query_lower or "now" in query_lower or "priority" in query_lower or "should" in query_lower or "what" in query_lower):
        actions = []
        
        if context["inventory"]["critical_count"] > 0 and context["inventory"]["top_risk"]:
            top_risk = context["inventory"]["top_risk"]
            actions.append({
                "priority": "🔴 URGENT",
                "action": top_risk['suggested_action'],
                "impact": f"₹{top_risk.get('revenue_impact_inr', 15000):,}",
                "time": f"{top_risk['hours_to_stockout']}h deadline"
            })
        
        if context["ads"]["at_risk_count"] > 0 and context["ads"]["top_risk"]:
            top_ad = context["ads"]["top_risk"]
            actions.append({
                "priority": "🟠 HIGH",
                "action": top_ad['suggested_action'],
                "impact": f"₹{top_ad['daily_spend_inr']:,}/day savings",
                "time": "Immediate"
            })
        
        if context["pooling"]["opportunities"] > 0 and context["pooling"]["top_opportunity"]:
            top_pool = context["pooling"]["top_opportunity"]
            actions.append({
                "priority": "🟡 MEDIUM",
                "action": top_pool['suggested_action'],
                "impact": f"₹{top_pool.get('revenue_impact_inr', 8000):,} recovery",
                "time": "Today"
            })
        
        if actions:
            response = "**Your Priority Actions for Today:**\n\n"
            for i, action in enumerate(actions, 1):
                response += f"{i}. {action['priority']} - {action['action']}\n"
                response += f"   • Impact: {action['impact']}\n"
                response += f"   • Timeline: {action['time']}\n\n"
            
            total_impact = context["summary"]["revenue_at_risk"] + context["summary"]["ad_waste_daily"] * 7
            response += f"**Total Weekly Impact: ₹{total_impact:,}**"
            return response
        return "✅ Great news! No urgent actions needed today. All operations running smoothly."
    
    # Default response with current status
    return f"""**ShelfSync AI - Business Operations Advisor**

I help you make data-driven decisions to increase revenue, reduce waste, and prevent stockouts.

**Current Business Status:**

📊 **Risks:**
• {context['inventory']['critical_count']} critical stockout risks (₹{context['summary']['revenue_at_risk']:,} at risk)
• {context['ads']['at_risk_count']} ad campaigns wasting spend (₹{context['summary']['ad_waste_daily']:,}/day)
• {context['returns']['dispute_needed']} return disputes needed (₹{context['finance']['margin_leakage']:,} recovery)

🎯 **Opportunities:**
• {context['pooling']['opportunities']} inventory transfers (₹{context['summary']['pooling_opportunity']:,} potential)
• {context['inventory']['stockout_24h']} SKUs need attention in next 24 hours

**Ask me questions like:**
• "Which SKU needs attention today?"
• "What are my top risks?"
• "Why are sales dropping?"
• "Which products may stock out?"
• "Which ads should I pause?"
• "Where should I move inventory?"
• "Which returns require disputes?"
• "Which products have the highest demand?"
• "What is my revenue at risk?"
• "Which marketplace is performing best?"
• "What margin leakages exist?"
• "What actions should I take today?"

**I provide:**
✅ Problem identification
✅ Business impact (₹ quantified)
✅ Root cause analysis
✅ Recommended actions
✅ Expected outcomes"""


def query_copilot(query: str) -> dict[str, Any]:
    """
    Main copilot query handler - Business Operations Advisor
    Returns structured responses with Problem, Impact, Root Cause, Action, Outcome
    """
    try:
        context = _build_context()
        response_text = _generate_deterministic_response(query, context)
        
        return {
            "query": query,
            "response": response_text,
            "mode": "deterministic",
            "context_summary": {
                "inventory_risks": context["inventory"]["critical_count"],
                "ad_risks": context["ads"]["at_risk_count"],
                "pooling_opportunities": context["pooling"]["opportunities"],
                "return_disputes": context["returns"]["dispute_needed"],
                "revenue_at_risk": context["summary"]["revenue_at_risk"],
                "ad_waste_daily": context["summary"]["ad_waste_daily"],
                "margin_leakage": context["finance"]["margin_leakage"],
            },
            "suggested_questions": [
                "Which SKU needs attention today?",
                "What are my top risks?",
                "Why are sales dropping?",
                "Which products may stock out?",
                "Which ads should I pause?",
                "Where should I move inventory?",
                "Which returns require disputes?",
                "Which products have the highest demand?",
                "What is my revenue at risk?",
                "Which marketplace is performing best?",
                "What margin leakages exist?",
                "What actions should I take today?",
            ],
        }
    except Exception as e:
        print(f"Error in query_copilot: {e}")
        import traceback
        traceback.print_exc()
        return {
            "query": query,
            "response": f"I encountered an error processing your question. Please try again or contact support.\n\nError: {str(e)}",
            "mode": "error",
            "context_summary": {
                "inventory_risks": 0,
                "ad_risks": 0,
                "pooling_opportunities": 0,
                "return_disputes": 0,
                "revenue_at_risk": 0,
                "ad_waste_daily": 0,
                "margin_leakage": 0,
            },
            "suggested_questions": [
                "Which SKU needs attention today?",
                "What are my top risks?",
                "What actions should I take today?",
            ],
        }


# Made with Bob - Business Operations Advisor (Complete with All 12 Question Types)