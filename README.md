# AfterClass

AfterClass helps McGill students discover activities and make group plans. This monorepo is the development foundation for the GDG McGill web, machine learning, and data engineering teams.

## Stack and ownership

| Path | Technology | Team responsibility |
| --- | --- | --- |
| `apps/web` | Next.js App Router, TypeScript, Tailwind, Supabase | Frontend, authentication, API routes, group sessions, business logic |
| `services/ml` | Python 3.12, FastAPI, NumPy, scikit-learn | Ranking, classification, training, evaluation |
| `services/ingestion` | Python 3.12, HTTPX, Beautiful Soup, Supabase SDK | Connectors, normalization, validation, deduplication, loading |
| `supabase` | Hosted PostgreSQL, Auth, Studio, SQL migrations | Shared development database and versioned schema |

See [the architecture note](docs/architecture.md) for service boundaries.

## Hosted development database

The team shares [AfterClass Development](https://supabase.com/dashboard/project/oqncgsvhobxwkxtiozwv) in the **AfterClass** Supabase organization (Canada Central). Its `public.venues` table has the starter migration and a McGill University seed row. Ask an organization owner for access if the project is not visible in your account. The repository's Supabase CLI is linked to this project on the setup machine. Each teammate links their own clone.

The web app uses the hosted database through the URL and publishable key in its ignored `apps/web/.env.local`. No local Supabase or Docker setup is required for the standard development workflow. The database password and secret API keys must never be placed in browser variables or Git.

## Prerequisites

Install Git, Node.js 24, npm, Python 3.12 (available through `uv`), and `uv`. The root npm install provides the Supabase CLI. On the setup Windows machine, use PowerShell because Ubuntu WSL currently fails to launch. The `scripts/use-node24.ps1` command selects the user-local Node 24 installation when an older system Node takes priority on PATH.

## First-time setup (PowerShell)

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
npx supabase login
npx supabase link --project-ref oqncgsvhobxwkxtiozwv
Copy-Item apps/web/.env.example apps/web/.env.local
Copy-Item services/ml/.env.example services/ml/.env
Copy-Item services/ingestion/.env.example services/ingestion/.env
```

In `apps/web/.env.local`, replace the publishable-key placeholder with the **AfterClass Development** publishable key from the project's Dashboard API Keys page. The project URL is already in the example. Keep the ingestion secret key blank until ingestion writes are implemented and approved; the current entry point does not use it.

## Run the services

Use separate PowerShell terminals. Run `. .\scripts\use-node24.ps1` from the repository root in terminals that use npm.

```powershell
# Terminal 1, from repository root
npm run dev:web

# Terminal 2
Set-Location services/ml
uv run python -m ml

# Ingestion is a command, not a long-running server
Set-Location services/ingestion
uv run python -m ingestion
```

Web: <http://localhost:3000>. Web health: <http://localhost:3000/api/health>. Venue API: <http://localhost:3000/api/venues>. ML proxy: <http://localhost:3000/api/ml/health>. ML health: <http://localhost:8001/health>. ML Swagger: <http://localhost:8001/docs>. Hosted Supabase Studio is available in the [Supabase Dashboard](https://supabase.com/dashboard/project/oqncgsvhobxwkxtiozwv/editor).

## Database migrations and types

The SQL source of truth is `supabase/migrations/`. Every teammate can inspect the linked development project's migration history with `npm run supabase:migrations`. A designated maintainer should review changes before applying them to the shared database:

```powershell
npx supabase db push --remote --dry-run
npx supabase db push --remote
npm run supabase:types
```

The seed record has already been applied to the hosted development database. Do not run a remote database reset as part of normal development. Commit new migration files and regenerated TypeScript types together.

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

## Environments and secrets

`APP_ENV` names the environment (`development`, `staging`, or `production`). Staging and production need their own Supabase projects, URL, keys, and deployment configuration. Store their values in the deployment provider's secret store, not in Git. Next.js loads `apps/web/.env.local`; Python settings load each service's `.env`. Only variables prefixed `NEXT_PUBLIC_` reach the browser, so never give a secret key that prefix. `ML_API_URL` is server-only. `MODEL_VERSION` labels the ML model used by the health endpoint.

## Contributing

Create a feature branch, keep changes in the owning service, add focused tests for behavior, run its lint and tests, and open a pull request. Commit SQL migrations for schema changes and regenerate TypeScript database types. Do not commit `.env` files or generated environments.
