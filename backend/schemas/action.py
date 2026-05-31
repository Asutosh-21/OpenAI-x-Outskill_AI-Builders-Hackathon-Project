from pydantic import BaseModel, Field


class ActionRequest(BaseModel):
    action_type: str = Field(..., examples=["replenishment", "pause_ads", "transfer", "dispute", "catalog_publish"])
    sku: str
    platform: str | None = None
    location: str | None = None
    units: int | None = None
    reason: str | None = None


class ActionResponse(BaseModel):
    action_id: str
    status: str
    action_type: str
    title: str
    message: str
    next_step: str
    eta_minutes: int
