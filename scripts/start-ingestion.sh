#!/usr/bin/env bash
cd "$(dirname "$0")/../services/ingestion" || exit 1
exec uv run python -m ingestion
