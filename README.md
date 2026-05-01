# Norvia Studio

A lightweight but comprehensive management system for creative agencies, design studios, and freelance teams — covering clients, projects, billing, and internal resources in a single workspace.

---

## What is Norvia Studio?

Norvia Studio is a multi-tenant SaaS platform that lets small creative teams manage their entire workflow in one place: onboard clients, track projects through their lifecycle, generate quotes and invoices, and manage team assignments — all scoped to a workspace and secured behind an authentication layer.

---

## Monorepo Structure

```
norvia-studio/
├── backend/        # Node.js / Express REST API (Clean Architecture)
├── frontend/       # Angular 21 SPA
├── .github/
│   └── workflows/
│       └── ci.yml  # GitHub Actions CI pipeline
├── .env.example    # Root environment variable template
└── README.md
```

Each sub-project is self-contained with its own `package.json`, TypeScript configuration, and README. See [`backend/README.md`](./backend/README.md) and [`frontend/README.md`](./frontend/README.md) for setup instructions.

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│              Angular SPA                │
│         (frontend — port 4200)          │
│                                         │
│  AuthService → Clerk → JWT token        │
│  HTTP interceptor attaches token        │
└────────────────────┬────────────────────┘
                     │ HTTPS / REST
                     ▼
┌─────────────────────────────────────────┐
│           Express REST API              │
│         (backend — port 3000)           │
│                                         │
│  Clerk middleware validates token       │
│  Clean Architecture layers:             │
│    Interface → Application → Domain     │
│               ↕                         │
│          Infrastructure                 │
│    (Supabase PostgreSQL via pg pool)    │
└─────────────────────────────────────────┘
```

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
- **Guards** — `authGuard` protects all authenticated routes via Clerk session state
- **Interceptors** — `authInterceptor` attaches the Clerk JWT to every outgoing request
- **Shared components** — a small design-system library (`Button`, `Input`, `Badge`, `Modal`, `Toast`, etc.) used throughout the feature pages

---

## Domain Model

| Entity | Description |
|---|---|
| **Workspace** | Top-level multi-tenant container; all resources belong to one |
| **Company** | Studio's own company info stored per workspace |
| **TeamMember** | Internal users with roles: `OWNER`, `ADMIN`, `SUPERADMIN`, `MEMBER` |
| **Client** | External clients with statuses: `ACTIVE`, `INACTIVE`, `PROSPECT` |
| **Project** | Work items with status (`DRAFT` → `ACTIVE` → `COMPLETED`) and priority |
| **Quote** | Price proposals (`DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`, `EXPIRED`) |
| **Invoice** | Billing documents (`DRAFT`, `SENT`, `PAID`, `OVERDUE`, `CANCELLED`) |
| **Assignment** | Many-to-many link between team members and projects |
| **QuoteItem / InvoiceItem** | Line items for quotes and invoices |

---

## Authentication

Authentication is handled by **[Clerk](https://clerk.com)** across both ends:

- The **frontend** uses `@clerk/clerk-js` to manage sign-in, sign-up, MFA, and session state; the `AuthService` initializes Clerk as an `APP_INITIALIZER`.
- The **backend** uses `@clerk/express` middleware; every protected route requires a valid session token in the `Authorization: Bearer <token>` header.

---

## API

Base URL: `http://localhost:3000` (development)

All endpoints are prefixed with `/api` and require a valid Clerk session token.

| Resource | Endpoints |
|---|---|
| Workspaces | `GET /workspaces`, `POST /workspaces`, `GET|PUT|DELETE /workspaces/:id` |
| Projects | `GET /projects?workspaceId=`, `POST /projects`, `GET|PUT|DELETE /projects/:id` |
| Clients | `GET /clients?workspaceId=`, `POST /clients`, `GET|PUT|DELETE /clients/:id` |
| Team members | `GET|POST /workspaces/:id/members`, `PUT|DELETE /workspaces/:id/members/:memberId` |
| Quotes | `GET|POST /quotes`, `GET|PUT|DELETE /quotes/:id` |
| Invoices | `GET|POST /invoices`, `GET|PUT|DELETE /invoices/:id` |

---

## CI Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) triggers on pushes to `develop` and `feature/**` branches and on pull requests to `develop`. It runs the following jobs in parallel:

**Frontend job:** install → lint → test → build (environment files are injected from GitHub secrets)

**Backend job:** install → lint → test

A separate Semgrep security scan runs on every push.

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
git clone <repo-url>
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

For detailed setup, database migration instructions, and environment variable reference see the sub-project READMEs:
- [Backend →](./backend/README.md)
- [Frontend →](./frontend/README.md)
