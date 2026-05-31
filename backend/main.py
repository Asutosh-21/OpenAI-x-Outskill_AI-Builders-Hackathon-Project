import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router

load_dotenv()

DEFAULT_CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]


def get_cors_origins() -> list[str]:
    origins = os.getenv("CORS_ORIGINS")
    if not origins:
        return DEFAULT_CORS_ORIGINS

    return [origin.strip().rstrip("/") for origin in origins.split(",") if origin.strip()]


app = FastAPI(
    title="ShelfSync AI API",
    description="AI operations copilot APIs for quick-commerce brands.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ShelfSync AI API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
