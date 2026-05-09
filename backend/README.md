# Norvia Studio — Backend

Node.js / Express REST API for Norvia Studio, built with TypeScript and Supabase.

---

## Tech Stack

| | |
|---|---|
| **Runtime** | Node.js 20+ |
| **Language** | TypeScript 5.9 (ES modules) |
| **Framework** | Express 5 |
| **Database** | Supabase (PostgreSQL) via `pg` (node-postgres) — direct connection through Supavisor pooler |
| **Auth** | Clerk (`@clerk/express`) |
| **Error tracking** | Sentry (`@sentry/node`) |
| **Testing** | Jest 29 + ts-jest |
| **Linting** | ESLint 9 |

---

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- A [Supabase](https://supabase.com) project
- A [Clerk](https://clerk.com) application (for auth keys)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` (located at the repository root) to `.env` in the same root folder, then fill in all values:

```env
EXPRESS_PORT=3000

SUPABASE_DB_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
SUPABASE_SCHEMA=dev

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

> `CORS_ORIGIN` defaults to `http://localhost:4200` if not set.
> `SUPABASE_DB_URL` is the **Transaction pooler** connection string found in your Supabase project under **Settings → Database → Connection pooling** (port `6543`).

### 3. Set up the database

The SQL migration scripts in `src/infrastructure/persistence/sql/` define the full schema. Run them in order in the **Supabase SQL Editor** (or via the Supabase CLI):

```
001_create_enums.sql
002_create_workspaces.sql
003_create_companies.sql
004_create_team_members.sql
005_create_clients.sql
006_create_quotes.sql
007_create_projects.sql
008_create_assignments.sql
009_create_quote_items.sql
010_create_invoices.sql
011_create_invoice_items.sql
```

### 4. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start in watch mode (via `tsx`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in interactive watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint all TypeScript source files |

---

## Project Structure

The backend follows **Clean Architecture** (also known as Hexagonal Architecture). Dependencies flow strictly inward: Infrastructure → Interface → Application → Domain.

```
src/
├── index.ts                      # Entry point — bootstraps Sentry, Express and Clerk
├── domain/
│   ├── model/                    # Core business entities (pure TypeScript classes)
│   ├── enums/                    # Domain enumerations (statuses, priorities, roles)
│   └── repositories/             # Repository interfaces (contracts, no implementation)
├── application/
│   ├── use-case/                 # One class per use case (GetProjects, CreateClient, …)
│   ├── service/                  # Shared application-level services
│   ├── response/                 # AppResponse — unified success response builder
│   └── error/                    # AppError — typed error class
├── interface/
│   ├── controller/               # Express route handlers delegating to use cases
│   ├── dto/                      # Data Transfer Objects for HTTP boundary
│   └── converter/                # DTO ↔ domain model converters
├── http/
│   ├── sentry.ts                 # Sentry initialisation (imported first in index.ts)
│   ├── routes.ts                 # All route definitions
│   ├── wiring.ts                 # Dependency injection — wires all layers at startup
│   └── errorHandler.ts           # Global error-handling middleware + Sentry capture
└── infrastructure/
    └── persistence/
        ├── dao/
        │   └── pg/               # Active — raw PostgreSQL DAOs (current implementation via Supavisor)
        ├── repository/           # IRepository implementations
        ├── po/                   # Persistence Objects (typed DB row shapes)
        ├── converter/            # PO ↔ domain model converters
        └── sql/                  # Numbered migration scripts (001 → 011)
```

### Layer responsibilities

**Domain** — Business entities and repository contracts. No framework dependencies.

**Application** — Use cases that orchestrate domain logic. Each use case receives its dependencies via constructor injection and is orchestrated by `wiring.ts`.

**Interface** — Translates HTTP requests into domain calls and domain results into HTTP responses. Controllers call use cases; DTOs define the public API shape; converters handle the mapping.

**Infrastructure** — PostgreSQL-backed implementations of repository interfaces. DAOs use `pg` (node-postgres) to query Supabase directly via the Supavisor connection pooler; converters map rows to domain objects.

---

## Database Layer

### Why Supabase

The original design targeted **Cloud SQL** (managed PostgreSQL on GCP), but that turned out to be overkill for the current stage of the project — provisioning a full Cloud SQL instance, configuring VPC networking, and managing IAM just to run a handful of tables adds unnecessary operational overhead before the product has found its footing.

**Supabase** solves the same problem with near-zero configuration: it provides a managed PostgreSQL database and a web console for running migrations. The schema itself is identical (the same SQL migration scripts run on both), so any future migration to a self-managed instance is purely at the DAO layer.

### How the database connection works

The backend connects to Supabase using **`pg` (node-postgres)** through the **Supavisor Transaction pooler** (port `6543`). This bypasses PostgREST entirely and talks directly to PostgreSQL, which means:

- standard parameterized queries (`$1`, `$2`, …) work without any serialization constraints
- transactions are fully supported — the pooler holds the connection for the duration of each transaction
- the `search_path` is set to the target schema via PostgreSQL startup options (`--search_path=<schema>`), so it survives connection recycling

---

## API Reference

All routes require a valid Clerk session token in the `Authorization: Bearer <token>` header. Base path: `/api`.

### Workspaces

| Method | Path | Description |
|---|---|---|
| `GET` | `/workspaces` | List all workspaces for the authenticated user |
| `GET` | `/workspaces/:id` | Get a workspace by ID |
| `GET` | `/workspaces/slug/:slug` | Get a workspace by slug |
| `POST` | `/workspaces` | Create a new workspace |
| `PUT` | `/workspaces/:id` | Update a workspace |
| `DELETE` | `/workspaces/:id` | Delete a workspace |

### Team Members

| Method | Path | Description |
|---|---|---|
| `GET` | `/workspaces/:id/members` | List members of a workspace |
| `POST` | `/workspaces/:id/members` | Add a member to a workspace |
| `PUT` | `/workspaces/:id/members/:memberId` | Update a member's role |
| `DELETE` | `/workspaces/:id/members/:memberId` | Remove a member |
| `POST` | `/members/activate-self` | Activate the caller's pending membership (for existing Clerk users accepting invitations) |

### Companies

| Method | Path | Description |
|---|---|---|
| `GET` | `/companies?workspaceId=` | List companies for a workspace (paginated) |
| `GET` | `/companies/:id` | Get a company by ID |
| `GET` | `/companies/:id/clients` | List clients belonging to a company (paginated) |
| `POST` | `/companies` | Create a company |
| `PUT` | `/companies/:id` | Update a company |
| `DELETE` | `/companies/:id` | Delete a company |

### Projects

| Method | Path | Description |
|---|---|---|
| `GET` | `/projects?workspaceId=` | List projects (paginated) |
| `GET` | `/projects/:id` | Get a project by ID |
| `POST` | `/projects` | Create a project |
| `PUT` | `/projects/:id` | Update a project |
| `DELETE` | `/projects/:id` | Delete a project |

### Clients

| Method | Path | Description |
|---|---|---|
| `GET` | `/clients?workspaceId=` | List clients (paginated) |
| `GET` | `/clients/:id` | Get a client by ID |
| `POST` | `/clients` | Create a client (optionally link to a company via `company.id`) |
| `PUT` | `/clients/:id` | Update a client |
| `DELETE` | `/clients/:id` | Delete a client |

### Assignments

| Method | Path | Description |
|---|---|---|
| `GET` | `/assignments?workspaceId=` | List all assignments for a workspace (batch, used for avatar stacks) |
| `GET` | `/projects/:id/assignments` | List assignments for a specific project |
| `POST` | `/projects/:id/assignments` | Assign a team member to a project |
| `DELETE` | `/assignments/:id` | Remove an assignment |

### Quotes

| Method | Path | Description |
|---|---|---|
| `GET` | `/quotes?workspaceId=` | List quotes for a workspace (paginated) |
| `GET` | `/quotes/:id` | Get a quote by ID (includes line items) |
| `GET` | `/clients/:id/quotes` | List quotes for a specific client |
| `POST` | `/quotes` | Create a quote with line items |
| `PUT` | `/quotes/:id` | Update a quote and its line items (delete-then-insert) |
| `PATCH` | `/quotes/:id/status` | Update quote status only (`DRAFT` → `SENT` → `ACCEPTED\|REJECTED`) |
| `DELETE` | `/quotes/:id` | Delete a quote and its line items |

### Invoices

| Method | Path | Description |
|---|---|---|
| `GET` | `/invoices?workspaceId=` | List invoices for a workspace (paginated) |
| `GET` | `/invoices/:id` | Get an invoice by ID (includes line items) |
| `GET` | `/clients/:id/invoices` | List invoices for a specific client |
| `POST` | `/invoices` | Create an invoice with line items |
| `PUT` | `/invoices/:id` | Update an invoice and its line items (delete-then-insert) |
| `PATCH` | `/invoices/:id/status` | Update invoice status only (`DRAFT` → `SENT` → `PAID`; sets `paid_at` automatically) |
| `DELETE` | `/invoices/:id` | Delete an invoice and its line items |

---

## Deployment (Cloud Run)

The backend is containerized and deployed to **Google Cloud Run** via **Artifact Registry**. A `Dockerfile` in the `backend/` directory handles the multi-stage build.

### Prerequisites

- [Docker](https://www.docker.com) (Desktop or CLI)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (`gcloud` CLI, authenticated)
- An Artifact Registry repository created in your GCP project
- All required secrets stored in **GCP Secret Manager**

### Secrets in Secret Manager

Cloud Run injects secrets as environment variables at runtime. The mapping below shows how Secret Manager key names map to the env vars the app expects:

| Secret Manager key | Env var in app | Description |
|---|---|---|
| `SUPABASE_URL` | `SUPABASE_DB_URL` | Supavisor Transaction pooler connection string |
| `SUPABASE_SCHEMA` | `SUPABASE_SCHEMA` | PostgreSQL schema name |
| `CLERK_SECRET_KEY` | `CLERK_SECRET_KEY` | Clerk secret key |
| `CORS_ORIGIN` | `CORS_ORIGIN` | Allowed CORS origin (frontend URL or `*`) |
| `SENTRY_DSN_BACKEND` | `SENTRY_DSN` | Sentry DSN for error tracking and performance monitoring |
| `CLERK_WEBHOOK_SECRET` | `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret (`whsec_...`) for verifying `POST /webhooks` payloads |
| `CLERK_INVITE_REDIRECT_URL` | `CLERK_INVITE_REDIRECT_URL` | URL the user is redirected to after accepting a workspace invitation |

> Cloud Run also injects `PORT` automatically; the app reads it via `process.env.PORT ?? process.env.EXPRESS_PORT`.

### Deploy steps

```bash
# 1. Authenticate Docker with Artifact Registry
gcloud auth configure-docker <REGION>-docker.pkg.dev

# 2. Build the image
# --platform linux/amd64 is required when building on Apple Silicon (ARM64)
docker build --platform linux/amd64 \
  -t <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPO>/<IMAGE_NAME>:latest \
  .

# 3. Push to Artifact Registry
docker push <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPO>/<IMAGE_NAME>:latest

# 4. Deploy to Cloud Run
gcloud run deploy <SERVICE_NAME> \
  --image <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPO>/<IMAGE_NAME>:latest \
  --region <REGION> \
  --platform managed \
  --allow-unauthenticated \
  --set-secrets \
    SUPABASE_DB_URL=SUPABASE_URL:latest,\
    SUPABASE_SCHEMA=SUPABASE_SCHEMA:latest,\
    CLERK_SECRET_KEY=CLERK_SECRET_KEY:latest,\
    CORS_ORIGIN=CORS_ORIGIN:latest,\
    SENTRY_DSN=SENTRY_DSN_BACKEND:latest
```

**Placeholder reference:**

| Placeholder | Example value |
|---|---|
| `<REGION>` | `europe-west8` |
| `<PROJECT_ID>` | GCP project ID |
| `<REPO>` | Artifact Registry repository name |
| `<IMAGE_NAME>` | `norvia-backend` |
| `<SERVICE_NAME>` | Cloud Run service name |

### Verify the deployment

```bash
curl https://<SERVICE_URL>/health
```

A successful response returns a timestamp string: `2024-01-01T00:00:00.000Z - Health ok`.

---

## Testing

Tests live in `test/` and cover DTO converters, use cases, and application logic. Jest is configured in `jest.config.cjs`.

```bash
npm test                  # run all tests
npm run test:watch        # interactive watch mode
npm run test:coverage     # generate HTML coverage report in coverage/
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `EXPRESS_PORT` | No | `3000` | Port the Express server listens on |
| `SUPABASE_DB_URL` | Yes | — | Supavisor Transaction pooler connection string (Settings → Database → Connection pooling, port `6543`) |
| `SUPABASE_SCHEMA` | Yes | — | PostgreSQL schema to target (e.g. `dev`) |
| `CLERK_PUBLISHABLE_KEY` | Yes | — | Clerk publishable key |S
| `CLERK_SECRET_KEY` | Yes | — | Clerk secret key |
| `CORS_ORIGIN` | No | `http://localhost:4200` | Allowed CORS origin |
