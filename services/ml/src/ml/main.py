from fastapi import FastAPI

from ml.config import Settings

app = FastAPI(title="AfterClass ML", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    settings = Settings()
    return {"status": "ok", "service": "ml", "model_version": settings.model_version}
