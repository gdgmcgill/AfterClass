import json

from ingestion.config import Settings


def main() -> None:
    settings = Settings()
    print(json.dumps({"status": "ok", "service": "ingestion", "environment": settings.app_env}))


if __name__ == "__main__":
    main()
