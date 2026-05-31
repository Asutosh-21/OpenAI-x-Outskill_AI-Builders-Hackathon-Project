from datetime import datetime
from hashlib import sha1

from schemas.action import ActionRequest, ActionResponse


ACTION_COPY = {
    "replenishment": {
        "title": "Replenishment order drafted",
        "message": "A replenishment workflow has been prepared for ops review.",
        "next_step": "Confirm distributor availability and approve transfer to dark store.",
        "eta": 18,
    },
    "pause_ads": {
        "title": "Ad pause recommendation queued",
        "message": "Campaign pause has been simulated against the low-stock SKU.",
        "next_step": "Sync campaign status once shelf availability recovers.",
        "eta": 5,
    },
    "transfer": {
        "title": "Cross-platform transfer plan created",
        "message": "A stock movement plan has been generated for the selected SKU.",
        "next_step": "Notify operations owner and confirm pickup slot.",
        "eta": 35,
    },
    "dispute": {
        "title": "Return dispute packet generated",
        "message": "Evidence bundle has been staged for marketplace dispute filing.",
        "next_step": "Attach return photos and submit claim.",
        "eta": 12,
    },
    "catalog_publish": {
        "title": "Catalog update staged",
        "message": "Marketplace-specific listing copy has been staged for publication.",
        "next_step": "Review compliance notes and publish selected variant.",
        "eta": 7,
    },
}


def execute_action(payload: ActionRequest) -> ActionResponse:
    template = ACTION_COPY.get(payload.action_type, ACTION_COPY["replenishment"])
    raw_id = f"{payload.action_type}:{payload.sku}:{payload.platform}:{payload.location}:{datetime.utcnow().isoformat()}"
    action_id = f"ACT-{sha1(raw_id.encode('utf-8')).hexdigest()[:8].upper()}"
    detail = []
    if payload.platform:
        detail.append(payload.platform)
    if payload.location:
        detail.append(payload.location)
    if payload.units:
        detail.append(f"{payload.units} units")

    suffix = f" ({', '.join(detail)})" if detail else ""
    return ActionResponse(
        action_id=action_id,
        status="queued",
        action_type=payload.action_type,
        title=template["title"],
        message=f"{template['message']}{suffix}",
        next_step=template["next_step"],
        eta_minutes=template["eta"],
    )
