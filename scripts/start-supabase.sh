#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit 1
exec npm run supabase:start
