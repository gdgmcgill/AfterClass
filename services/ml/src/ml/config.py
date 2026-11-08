from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "development"
    model_version: str = "dev-1"
    ml_host: str = "127.0.0.1"
    ml_port: int = 8001
