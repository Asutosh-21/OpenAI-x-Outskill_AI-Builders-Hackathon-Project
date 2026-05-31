from fastapi import APIRouter
from pydantic import BaseModel

from schemas.action import ActionRequest
from schemas.catalog import CatalogRequest
from services.action_service import execute_action
from services.dashboard_service import dashboard_summary
from agents.inventory_agent import inventory_risks
from agents.ad_agent import ad_recommendations
from agents.catalog_agent import generate_catalog_variants
from agents.returns_agent import returns_audit
from agents.pooling_agent import pooling_recommendations
from agents.copilot_agent import query_copilot
from services.alert_service import alerts

router = APIRouter()


class CopilotQuery(BaseModel):
    query: str


@router.get("/dashboard/summary")
def get_dashboard_summary():
    return dashboard_summary()


@router.get("/inventory/risks")
def get_inventory_risks():
    return inventory_risks()


@router.get("/ads/recommendations")
def get_ad_recommendations():
    return ad_recommendations()


@router.post("/catalog/generate")
def post_catalog_generate(payload: CatalogRequest):
    return generate_catalog_variants(payload)


@router.get("/returns/audit")
def get_returns_audit():
    return returns_audit()


@router.get("/pooling/recommendations")
def get_pooling_recommendations():
    return pooling_recommendations()


@router.get("/alerts")
def get_alerts():
    return alerts()


@router.post("/actions/execute")
def post_execute_action(payload: ActionRequest):
    return execute_action(payload)


@router.post("/copilot/query")
def post_copilot_query(payload: CopilotQuery):
    return query_copilot(payload.query)
