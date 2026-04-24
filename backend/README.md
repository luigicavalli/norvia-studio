# Norvia Studio — Backend

Node.js / Express REST API for Norvia Studio, built with TypeScript and PostgreSQL.

---

## Tech Stack

| | |
|---|---|
| **Runtime** | Node.js 20+ |
| **Language** | TypeScript 5.9 (ES modules) |
| **Framework** | Express 5 |
| **Database** | PostgreSQL 14+ via `pg` |
| **Auth** | Clerk (`@clerk/express`) |
| **Testing** | Jest 29 + ts-jest |
| **Linting** | ESLint 9 |

---

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- A running PostgreSQL instance
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

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB_NAME=norvia_studio
POSTGRES_PORT=5432

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

> `CORS_ORIGIN` defaults to `http://localhost:4200` if not set.

### 3. Set up the database

Create the database and run the migration scripts in order:

```bash
psql -U postgres -c "CREATE DATABASE norvia_studio;"

# Run migrations in order
psql -U postgres -d norvia_studio -f src/infrastructure/persistence/sql/001_create_enums.sql
psql -U postgres -d norvia_studio -f src/infrastructure/persistence/sql/002_create_workspaces.sql
psql -U postgres -d norvia_studio -f src/infrastructure/persistence/sql/003_create_companies.sql
psql -U postgres -d norvia_studio -f src/infrastructure/persistence/sql/004_create_team_members.sql
psql -U postgres -d norvia_studio -f src/infrastructure/persistence/sql/005_create_clients.sql
psql -U postgres -d norvia_studio -f src/infrastructure/persistence/sql/006_create_quotes.sql
psql -U postgres -d norvia_studio -f src/infrastructure/persistence/sql/007_create_projects.sql
psql -U postgres -d norvia_studio -f src/infrastructure/persistence/sql/008_create_assignments.sql
psql -U postgres -d norvia_studio -f src/infrastructure/persistence/sql/009_create_quote_items.sql
psql -U postgres -d norvia_studio -f src/infrastructure/persistence/sql/010_create_invoices.sql
psql -U postgres -d norvia_studio -f src/infrastructure/persistence/sql/011_create_invoice_items.sql
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
├── index.ts                      # Entry point — bootstraps Express and Clerk
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
│   ├── index.ts                  # Express app factory
│   ├── routes.ts                 # All route definitions
│   ├── wiring.ts                 # Dependency injection — wires all layers at startup
│   └── errorHandler.ts           # Global error-handling middleware
└── infrastructure/
    └── persistence/
        ├── dao/pg/               # PostgreSQL Data Access Objects
        ├── repository/           # IRepository implementations
        ├── po/                   # Persistence Objects (typed DB row shapes)
        ├── converter/            # PO ↔ domain model converters
        └── sql/                  # Numbered migration scripts (001 → 011)
```

### Layer responsibilities

**Domain** — Business entities and repository contracts. No framework dependencies.

**Application** — Use cases that orchestrate domain logic. Each use case receives its dependencies via constructor injection and is orchestrated by `wiring.ts`.

**Interface** — Translates HTTP requests into domain calls and domain results into HTTP responses. Controllers call use cases; DTOs define the public API shape; converters handle the mapping.

**Infrastructure** — PostgreSQL-backed implementations of repository interfaces. DAOs execute raw SQL; converters map rows to domain objects.

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
| `POST` | `/clients` | Create a client |
| `PUT` | `/clients/:id` | Update a client |
| `DELETE` | `/clients/:id` | Delete a client |

### Quotes & Invoices

Both follow the same CRUD pattern as Projects/Clients.

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
| `POSTGRES_USER` | Yes | — | PostgreSQL user |
| `POSTGRES_PASSWORD` | Yes | — | PostgreSQL password |
| `POSTGRES_DB_NAME` | Yes | — | Database name |
| `POSTGRES_PORT` | No | `5432` | PostgreSQL port |
| `CLERK_PUBLISHABLE_KEY` | Yes | — | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | — | Clerk secret key |
| `CORS_ORIGIN` | No | `http://localhost:4200` | Allowed CORS origin |
