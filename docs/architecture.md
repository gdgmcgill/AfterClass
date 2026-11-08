# Architecture

AfterClass uses one repository with three independently runnable applications and one shared hosted development database.

- `apps/web` is the full-stack Next.js application. Route Handlers own the initial public API and later user sessions, group decisions, and business rules.
- `services/ml` is a FastAPI process on port 8001. The web server calls it through `ML_API_URL`; browsers never call it directly.
- `services/ingestion` is a Python command-line process for future source connectors, normalization, validation, deduplication, and database writes. It currently performs no scraping or writes.
- `supabase` contains SQL migrations, seed data, and CLI configuration. The hosted **AfterClass Development** project supplies PostgreSQL, Auth, Studio, and the Data API. The web API reads `venues` with a publishable key and a public read policy. Future ingestion writes will require a server-only secret key.

The development web process runs on port 3000. The browser calls Next.js Route Handlers, which reach hosted Supabase or the local ML process. The hosted development project is shared by the team; staging and production will need separate Supabase projects and environment variables. Supabase calls the default branch of each hosted project `main` or `Production`, even when the project itself is designated for development.
