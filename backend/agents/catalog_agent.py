import os

from schemas.catalog import CatalogRequest
from utils.data_loader import load_json


def _catalog_seed(sku: str) -> dict:
    for row in load_json("catalog.json"):
        if row["sku"] == sku:
            return row
    return load_json("catalog.json")[0]


def _generate_with_openai(title: str, category: str, features: list[str]) -> list[dict]:
    """Generate catalog variants using OpenAI"""
    try:
        from openai import OpenAI
        
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        feature_text = ", ".join(features)
        
        prompt = f"""Generate 3 marketplace listing variants for Indian quick-commerce platforms.

Product: {title}
Category: {category}
Features: {feature_text}

Create optimized listings for:
1. Blinkit (fast, utility-focused, clear)
2. Zepto (youthful, trendy, urgent)
3. Instamart (retail-friendly, benefit-led)

For each platform, provide:
- Optimized title (max 60 chars)
- Short description (max 120 chars)
- Content quality score (0-100)

Format as JSON array with: platform, title, description, content_score, tone"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a marketplace listing optimization expert for Indian quick-commerce."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            temperature=0.8,
        )
        
        content = response.choices[0].message.content or ""
        
        # Try to parse JSON from response
        import json
        import re
        
        # Extract JSON array from response
        json_match = re.search(r'\[.*\]', content, re.DOTALL)
        if json_match:
            variants = json.loads(json_match.group())
            return variants
        
        # Fallback to deterministic if parsing fails
        return _generate_deterministic(title, category, features)
        
    except Exception as e:
        print(f"OpenAI catalog generation error: {e}")
        return _generate_deterministic(title, category, features)


def _generate_deterministic(title: str, category: str, features: list[str]) -> list[dict]:
    """Generate catalog variants using deterministic logic"""
    feature_text = ", ".join(features[:3])
    
    return [
        {
            "platform": "Blinkit",
            "title": f"{title} - Fast Delivery Ready",
            "description": f"Get {title} in minutes. Best for quick baskets: {feature_text}.",
            "content_score": 92,
            "tone": "clear, fast, utility-led",
        },
        {
            "platform": "Zepto",
            "title": f"{title} | Instant Quick-Commerce Pack",
            "description": f"Trending pick for nearby shoppers. Highlights: {feature_text}.",
            "content_score": 89,
            "tone": "youthful, concise, urgency-led",
        },
        {
            "platform": "Instamart",
            "title": f"{title} for Daily Essentials Delivery",
            "description": f"Optimized for high-intent shoppers looking for {category.lower()} products with {feature_text}.",
            "content_score": 87,
            "tone": "retail-friendly, benefit-led",
        },
    ]


def generate_catalog_variants(payload: CatalogRequest) -> dict:
    seed = _catalog_seed(payload.sku)
    title = payload.product_title or seed["title"]
    category = payload.category or seed["category"]
    features = payload.features or seed["features"]
    
    api_key = os.getenv("OPENAI_API_KEY")
    
    if api_key:
        try:
            variants = _generate_with_openai(title, category, features)
            mode = "openai"
        except Exception:
            variants = _generate_deterministic(title, category, features)
            mode = "deterministic-fallback"
    else:
        variants = _generate_deterministic(title, category, features)
        mode = "deterministic-fallback"
    
    return {
        "sku": payload.sku,
        "title": title,
        "product_title": title,
        "category": category,
        "features": features,
        "mode": mode,
        "recommendation": "Use platform-specific titles instead of one shared marketplace listing.",
        "variants": variants,
    }
