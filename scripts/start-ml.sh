#!/usr/bin/env bash
cd "$(dirname "$0")/../services/ml" || exit 1
exec uv run python -m ml
