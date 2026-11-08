import uvicorn

from ml.config import Settings


def main() -> None:
    settings = Settings()
    uvicorn.run("ml.main:app", host=settings.ml_host, port=settings.ml_port)


if __name__ == "__main__":
    main()
