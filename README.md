# Norvia Studio

A lightweight but comprehensive management system for creative agencies, design studios, and freelance teams — covering clients, projects, billing, and internal resources in a single workspace.

---

## What is Norvia Studio?

Norvia Studio is a multi-tenant SaaS platform that lets small creative teams manage their entire workflow in one place: onboard clients, track projects through their lifecycle, generate quotes and invoices, and manage team assignments — all scoped to a workspace and secured behind an authentication layer.

---

## Monorepo Structure

```
norvia-studio/
├── backend/             # Node.js / Express REST API (Clean Architecture)
├── frontend/            # Angular 21 SPA
├── .github/
│   └── workflows/
│       ├── ci.yml       # GitHub Actions CI pipeline
│       ├── cd.yml       # GitHub Actions CD pipeline
│       └── preview.yml  # GitHub Actions Firebase Preview pipeline
├── .env.example         # Root environment variable template
└── README.md
```

Each sub-project is self-contained with its own `package.json`, TypeScript configuration, and README. See [`backend/README.md`](./backend/README.md) and [`frontend/README.md`](./frontend/README.md) for setup instructions.

---

## Architecture Overview

```
┌──────────────────────────────────────────┐
│          Firebase Hosting (CDN)          │
│         Angular SPA — prod build         │
│                                          │
│  AuthService → Clerk → JWT token         │
│  HTTP interceptor attaches token         │
└─────────────────┬────────────────────────┘
                  │ HTTPS / REST
                  ▼
┌──────────────────────────────────────────┐
│          Google Cloud Run                │
│         Express REST API                 │
│                                          │
│  Clerk middleware validates token        │
│  Clean Architecture layers:              │
│    Interface → Application → Domain      │
│               ↕                          │
│          Infrastructure                  │
│    (Supabase PostgreSQL via pg pool)     │
└──────────────────────────────────────────┘
```

**Local development:** Angular dev server on port `4200`, Express on port `3000`.

### Backend — Clean / Hexagonal Architecture

The backend is organized in four concentric layers, each with a strict dependency rule (outer layers depend on inner ones, never the reverse):

| Layer | Responsibility |
|---|---|
| **Domain** | Core business entities, enums, and repository interfaces |
| **Application** | Use cases orchestrating domain logic; `AppResponse` / `AppError` helpers |
| **Interface** | Express controllers, DTOs, and converters that translate HTTP ↔ domain |
| **Infrastructure** | PostgreSQL DAOs (via `pg` + Supavisor pooler), repository implementations, and SQL migration scripts |

Dependency injection is bootstrapped in `src/http/wiring.ts`, which instantiates all layers and wires them together at startup.

### Frontend — Angular Standalone

The frontend follows standard Angular patterns with no NgModules:

- **Services** — thin wrappers around `HttpClient`, exposing Angular signals for reactive state
- **Guards** — `authGuard` protects all authenticated routes; `guestGuard` redirects already-authenticated users away from the login page
- **Interceptors** — `authInterceptor` attaches the Clerk JWT to every outgoing request
- **Shared components** — a small design-system library (`Button`, `Input`, `Badge`, `Modal`, `Toast`, etc.) used throughout the feature pages

---

## Domain Model

| Entity | Description |
|---|---|
| **Workspace** | Top-level multi-tenant container; all resources belong to one |
| **Company** | External companies (aziende) linked to a workspace; clients can be assigned to a company |
| **TeamMember** | Internal users with roles: `OWNER`, `ADMIN`, `SUPERADMIN`, `MEMBER`, `VIEWER` |
| **Client** | External clients with statuses: `ACTIVE`, `INACTIVE`, `PROSPECT`; optionally linked to a Company |
| **Project** | Work items with status (`DRAFT` → `ACTIVE` → `COMPLETED`) and priority |
| **Quote** | Price proposals (`DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`, `EXPIRED`) |
| **Invoice** | Billing documents (`DRAFT`, `SENT`, `PAID`, `OVERDUE`, `CANCELLED`) |
| **Assignment** | Many-to-many link between team members and projects |
| **QuoteItem / InvoiceItem** | Line items for quotes and invoices |

---

## Authentication

Authentication is handled by **[Clerk](https://clerk.com)** across both ends:

- The **frontend** uses `@clerk/clerk-js` to manage sign-in, sign-up, MFA, and session state; the `AuthService` initializes Clerk via `provideAppInitializer`.
- The **backend** uses `@clerk/express` middleware; every protected route requires a valid session token in the `Authorization: Bearer <token>` header.

---

## API

Base URL:
- **Development:** `http://localhost:3000`
- **Production:** `https://<cloud-run-service-url>` (set in `frontend/src/environments/environment.prod.ts`)

All endpoints are prefixed with `/api` and require a valid Clerk session token.

| Resource | Endpoints |
|---|---|
| Workspaces | `GET /workspaces`, `POST /workspaces`, `GET\|PUT\|DELETE /workspaces/:id` |
| Companies | `GET /companies?workspaceId=`, `POST /companies`, `GET\|PUT\|DELETE /companies/:id`, `GET /companies/:id/clients` |
| Projects | `GET /projects?workspaceId=`, `POST /projects`, `GET\|PUT\|DELETE /projects/:id`, `PATCH /projects/:id/status` |
| Clients | `GET /clients?workspaceId=`, `POST /clients`, `GET\|PUT\|DELETE /clients/:id`, `GET /clients/:id/quotes`, `GET /clients/:id/invoices` |
| Team members | `GET\|POST /workspaces/:id/members`, `PUT\|DELETE /workspaces/:id/members/:memberId`, `POST /members/activate-self` |
| Assignments | `GET /assignments?workspaceId=`, `GET /projects/:id/assignments`, `POST /projects/:id/assignments`, `DELETE /assignments/:id` |
| Quotes | `GET /quotes?workspaceId=`, `GET /quotes/:id`, `POST /quotes`, `PUT /quotes/:id`, `PATCH /quotes/:id/status`, `DELETE /quotes/:id` |
| Invoices | `GET /invoices?workspaceId=`, `GET /invoices/:id`, `POST /invoices`, `PUT /invoices/:id`, `PATCH /invoices/:id/status`, `DELETE /invoices/:id` |

---

## Monitoring & Error Tracking

Both services are instrumented with **[Sentry](https://sentry.io)** for error tracking and performance monitoring.

- **Backend** (`@sentry/node`) — initialised before Express boots; captures all unhandled exceptions and 5xx errors with `captureException`. DSN injected at runtime via the `SENTRY_DSN` Cloud Run secret.
- **Frontend** (`@sentry/angular`) — initialised in `main.ts` before `bootstrapApplication`; uses `SentryErrorHandler` and `TraceService` for router-level tracing. DSN injected at build time via `environment.sentryDsn`. Disabled in local development (empty string).
- **User context** — `AuthService.syncState()` calls `Sentry.setUser()` on every session change, attaching the user's email and Clerk ID to each event. Cleared automatically on logout.

---

## CI/CD Pipelines

### CI (`.github/workflows/ci.yml`)

Triggers on pushes to `develop` and `feature/**` branches and on pull requests to `develop` or `main`.

| Job | Steps |
|---|---|
| **frontend** | install → lint → test → build (environment injected from secrets) |
| **backend** | install → lint → test |
| **semgrep** | static security scan |
| **owasp** | OWASP Dependency-Check against NVD; fails on CVSS ≥ 7 (HIGH/CRITICAL); always uploads HTML report as artifact |

### Preview (`.github/workflows/preview.yml`)

Triggers on pull requests to `main` (opened, pushed, reopened). Deploys the frontend to a temporary Firebase Hosting preview channel and posts the URL as a comment on the PR. The channel expires automatically after 7 days. No new secrets required — reuses `GCP_SA_KEY`, `GCP_PROJECT_ID`, `CLERK_PUBLISHABLE_KEY`, and `API_URL`.

| Job | Steps |
|---|---|
| **preview-frontend** | install → inject environment from secrets (Sentry DSN left empty) → `ng build --configuration production` → deploy to Firebase preview channel → comment PR with URL |

### CD (`.github/workflows/cd.yml`)

Triggers on pushes to `main` (i.e. when a PR from `develop` is merged). Deploys both services in parallel.

| Job | Steps |
|---|---|
| **deploy-backend** | auth → build Docker image (`--platform linux/amd64`) → push to Artifact Registry → `gcloud run deploy` |
| **deploy-frontend** | install → inject `environment.prod.ts` from secrets → `ng build --configuration production` → `firebase deploy --only hosting` |

#### Required GitHub secrets

| Secret | Used by | Description |
|---|---|---|
| `GCP_SA_KEY` | both | Service account JSON key (roles: Artifact Registry Writer, Cloud Run Admin, IAM Service Account User, Firebase Hosting Admin) |
| `GCP_PROJECT_ID` | both | GCP / Firebase project ID |
| `GCP_REGION` | backend | GCP region (e.g. `europe-west8`) |
| `GCP_AR_REPO` | backend | Artifact Registry repository name |
| `GCP_CLOUD_RUN_SERVICE` | backend | Cloud Run service name |
| `CLERK_PUBLISHABLE_KEY` | frontend | Clerk publishable key |
| `API_URL` | frontend | Production Cloud Run base URL |
| `SENTRY_DSN_FRONTEND` | frontend | Sentry DSN for the Angular project |
| `NVD_API_KEY` | CI (owasp) | NVD API key for faster CVE database downloads |

#### Required GCP Secret Manager secrets

| Secret | Used by | Description |
|---|---|---|
| `SENTRY_DSN_BACKEND` | backend | Sentry DSN for the Node.js project |
| `CLERK_WEBHOOK_SECRET` | backend | Clerk webhook signing secret (`whsec_...`) for verifying `POST /webhooks` payloads |
| `CLERK_INVITE_REDIRECT_URL` | backend | URL the user lands on after accepting a workspace invitation |
| `SUPABASE_URL` | backend | Supabase database connection URL |
| `SUPABASE_SCHEMA` | backend | Supabase schema name |
| `CLERK_SECRET_KEY` | backend | Clerk secret key |
| `CORS_ORIGIN` | backend | Allowed CORS origin |

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 20 |
| npm | 10 |
| Supabase | account + project |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/luigicavalli/norvia-studio.git
cd norvia-studio

# 2. Set up backend
cd backend && cp ../.env.example .env   # fill in values
npm install && npm run dev

# 3. Set up frontend (new terminal)
cd frontend
cp src/environments/environment.example.ts src/environments/environment.ts
# fill in clerkPublishableKey and apiUrl
npm install && npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

For detailed setup, database migration instructions, environment variable reference, and deployment commands see the sub-project READMEs:
- [Backend →](./backend/README.md) — includes Cloud Run deployment steps
- [Frontend →](./frontend/README.md) — includes Firebase Hosting deployment steps
