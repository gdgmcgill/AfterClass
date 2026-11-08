# AfterClass

AfterClass helps McGill students discover activities and make group plans. This monorepo is the development foundation for the GDG McGill web, machine learning, and data engineering teams.

## Stack and ownership

| Path | Technology | Team responsibility |
| --- | --- | --- |
| `apps/web` | Next.js App Router, TypeScript, Tailwind, Supabase | Frontend, authentication, API routes, group sessions, business logic |
| `services/ml` | Python 3.12, FastAPI, NumPy, scikit-learn | Ranking, classification, training, evaluation |
| `services/ingestion` | Python 3.12, HTTPX, Beautiful Soup, Supabase SDK | Connectors, scraping, normalization, validation, deduplication, loading |
| `supabase` | PostgreSQL, Auth, Studio, SQL migrations | Shared database schema and local services |

See [the architecture note](docs/architecture.md) for service boundaries.

## Prerequisites

Install Git, Node.js 24, npm, Python 3.12 (available through `uv`), `uv`, and Docker Desktop. Start Docker Desktop before starting Supabase. The root npm install provides the Supabase CLI. On this Windows machine, use PowerShell because the Ubuntu WSL distribution currently fails to launch; Docker itself works from PowerShell. On another machine, use equivalent shell commands. The `scripts/use-node24.ps1` command selects the user-local Node 24 installation when an older system Node takes priority on PATH.

## First-time local setup (PowerShell)

```powershell
git clone https://github.com/gdgmcgill/AfterClass.git
Set-Location AfterClass
. .\scripts\use-node24.ps1
node --version  # 24.x
uv python install 3.12
npm ci
npm --prefix apps/web ci
uv sync --directory services/ml --frozen --dev
uv sync --directory services/ingestion --frozen --dev
npm run supabase:start
npm run supabase:status
Copy-Item apps/web/.env.example apps/web/.env.local
Copy-Item services/ml/.env.example services/ml/.env
Copy-Item services/ingestion/.env.example services/ingestion/.env
```

Replace the placeholder keys in the ignored local files with the **local** publishable and secret keys shown by `npm run supabase:status`. The web app needs only the publishable key for public venue reads. The ingestion secret key stays server-side and is not needed by the current entry point. Do not use a production key locally.

The initial migration and seed run during `supabase start`. To reapply local migrations and seed data after edits, run `npm run supabase:reset`; this resets **only the local Supabase database** and discards its local data. To generate updated database types, run `npm run supabase:types`.

## Run the services

Use separate PowerShell terminals. In each terminal that runs npm, run `. .\scripts\use-node24.ps1` from the repository root first:

```powershell
# Terminal 1, from repository root
npm run supabase:start

# Terminal 2
Set-Location services/ml
uv run python -m ml

# Terminal 3, from repository root
npm run dev:web

# Ingestion is a command, not a long-running server
Set-Location services/ingestion
uv run python -m ingestion
```

Web: <http://localhost:3000>. Web health: <http://localhost:3000/api/health>. Venue API: <http://localhost:3000/api/venues>. ML proxy: <http://localhost:3000/api/ml/health>. ML health: <http://localhost:8001/health>. ML Swagger: <http://localhost:8001/docs>. Supabase Studio: <http://127.0.0.1:54323>.

## Checks

```powershell
npm run lint:web
npm run typecheck:web
npm run build:web
uv run --directory services/ml ruff check .
uv run --directory services/ml pytest
uv run --directory services/ingestion ruff check .
uv run --directory services/ingestion pytest
```

## Hosted development project

The [AfterClass Development dashboard](https://supabase.com/dashboard/project/oqncgsvhobxwkxtiozwv) is a separate hosted database in the **AfterClass** Supabase organization (Canada Central). Its `public.venues` table has the starter migration and McGill University seed row. The local Docker database remains available and does not synchronize automatically with the hosted database.

To link a new clone to this development project:

```powershell
npx supabase login
npx supabase link --project-ref oqncgsvhobxwkxtiozwv
npx supabase migration list --remote
```

Only a designated maintainer should apply new reviewed migrations with `npx supabase db push --remote`. The web app continues to use the local Supabase URL in its ignored `apps/web/.env.local`. To point it at the hosted development database, replace that file's `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with the project's URL and publishable key from the Supabase Dashboard. Keep secret keys server-side and out of Git.

## Environments and secrets

`APP_ENV` names the environment (`development`, `staging`, or `production`). Each environment needs its own Supabase project, URL, keys, and deployment configuration. Store staging and production values in the deployment provider's secret store, not in Git. Next.js loads `apps/web/.env.local`; Python settings load each service's `.env`. Only variables prefixed `NEXT_PUBLIC_` reach the browser, so never give a secret key that prefix. `ML_API_URL` is server-only. `MODEL_VERSION` labels the ML model used by the health endpoint.

## Contributing

Create a feature branch, keep changes in the owning service, add focused tests for behavior, run its lint and tests, and open a pull request. Commit SQL migrations for schema changes and regenerate TypeScript database types. Do not commit `.env` files or generated environments.
