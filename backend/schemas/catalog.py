from pydantic import BaseModel, Field


class CatalogRequest(BaseModel):
    sku: str = Field(default="SYN-BUDS-MINI")
    product_title: str | None = None
    category: str | None = None
    features: list[str] | None = None
