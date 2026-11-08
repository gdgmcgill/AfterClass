# Architecture

AfterClass uses one repository with three independently runnable applications.

- `apps/web` is the full-stack Next.js application. Route Handlers own the initial public API and later user sessions, group decisions, and business rules.
- `services/ml` is a FastAPI process on port 8001. The web server calls it through `ML_API_URL`; browsers never call it directly.
- `services/ingestion` is a Python command-line process for future source connectors, normalization, validation, deduplication, and database writes. It currently performs no scraping or writes.
- `supabase` owns local PostgreSQL, authentication, Studio, migrations, and seed data. The web API reads `venues` with a publishable key and a public read policy. The ingestion service will use a server-only secret key when write features are added.

The local web process runs on port 3000. The browser calls Next.js Route Handlers, which reach Supabase or the ML service. Development, staging, and production use separate Supabase projects and environment variables. Never reuse local or production secrets between environments.
