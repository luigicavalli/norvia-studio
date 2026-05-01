# Norvia Studio — Frontend

Angular 21 single-page application for Norvia Studio.

---

## Tech Stack

| | |
|---|---|
| **Framework** | Angular 21 (standalone components, no NgModules) |
| **Language** | TypeScript 5.9 |
| **Build tool** | Angular CLI 21 / Vite 7 |
| **Auth** | Clerk (`@clerk/clerk-js`) |
| **HTTP** | Angular `HttpClient` |
| **Reactive state** | Angular Signals + RxJS 7 |
| **Testing** | Vitest 4 + Angular testing utilities |
| **Linting** | ESLint 10 |
| **Formatting** | Prettier 3 |

---

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- A running Norvia Studio backend (see [`../backend/README.md`](../backend/README.md))
- A [Clerk](https://clerk.com) application (for the publishable key)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Copy the example environment file and fill in your values:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

```typescript
// src/environments/environment.ts
export const environment = {
  production:          false,
  clerkPublishableKey: 'pk_test_...',
  apiUrl:              'http://localhost:3000',
};
```

> The `environment.ts` file is git-ignored. Never commit real keys.

### 3. Start the development server

```bash
npm start
```

The app will be available at [http://localhost:4200](http://localhost:4200).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start the development server (`ng serve`) |
| `npm run build` | Production build to `dist/` |
| `npm run watch` | Development build in watch mode |
| `npm test` | Run the unit test suite |
| `npm run lint` | Lint all TypeScript source files |

---

## Project Structure

```
src/
├── main.ts                          # Bootstrap
├── styles.scss                      # Global styles
├── environments/
│   ├── environment.ts               # Development config (git-ignored)
│   ├── environment.prod.ts          # Production config (git-ignored)
│   └── environment.example.ts      # Template — copy to environment.ts
├── types/
│   └── api.types.ts                 # Shared API response types
├── services/
│   ├── auth.service.ts              # Clerk session management
│   ├── workspace.service.ts         # Workspace API + signal state
│   ├── project.service.ts           # Project API + signal state
│   ├── client.service.ts            # Client API + signal state
│   └── team.service.ts              # Team member API + signal state
├── app/
│   ├── app.ts                       # Root component
│   ├── app.config.ts                # provideRouter, provideHttpClient, APP_INITIALIZER
│   ├── app.routes.ts                # Route definitions
│   ├── guards/
│   │   └── auth.guard.ts            # Redirects unauthenticated users to /
│   └── interceptors/
│       └── auth.interceptor.ts      # Attaches Clerk JWT to every request
└── feature/
    ├── pages/
    │   ├── index/                   # Public landing page (no auth)
    │   ├── home/                    # Dashboard
    │   ├── projects/                # Project list and detail
    │   ├── clients/                 # Client list and detail
    │   ├── team/                    # Team management
    │   ├── account/                 # User profile and preferences
    │   └── settings/                # Workspace settings
    └── components/
        ├── shell/                   # Authenticated layout wrapper
        ├── navbar/                  # Top navigation bar
        ├── sidebar/                 # Side navigation
        └── shared/                  # Reusable UI design-system components
            ├── avatar/
            ├── badge/
            ├── button/
            ├── datepicker/
            ├── input/
            ├── modal/
            ├── select/
            ├── table/
            ├── toast/
            └── toggle/
```

---

## Key Patterns

### Signals for state

Services expose Angular Signals as read-only state. Components read them directly without subscriptions:

```typescript
// In a component template
{{ projectService.projects().length }} active projects
```

Each service has a `load()` method that fetches from the API and updates the signal; `create()`, `update()`, and `remove()` methods that mutate the resource and reload automatically.

### Authentication flow

1. `app.config.ts` registers `AuthService.init()` as an `APP_INITIALIZER` — Clerk is fully loaded before the app renders.
2. `authGuard` checks `authService.isSignedIn()` on every protected navigation; unauthenticated users are redirected to `/`.
3. `authInterceptor` calls `authService.getToken()` and injects `Authorization: Bearer <token>` into every outgoing HTTP request.

### Routing

```
/            → IndexPage        (public)
/home        → HomePage         (auth required)
/projects    → ProjectsPage     (auth required)
/clients     → ClientsPage      (auth required)
/team        → TeamPage         (auth required)
/account     → AccountPage      (auth required)
/settings    → SettingsPage     (auth required)
**           → redirect to /
```

All authenticated routes are rendered inside the `ShellComponent`, which provides the navbar and sidebar layout.

---

## Deployment (Firebase Hosting)

The frontend is deployed to **Firebase Hosting**. The `firebase.json` and `.firebaserc` files are already committed; no additional configuration is needed.

### Prerequisites

```bash
npm install -g firebase-tools
firebase login
```

### Deploy steps

```bash
# 1. Build for production
#    Angular swaps environment.ts → environment.prod.ts automatically
npm run build

# 2. Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Production environment file

`src/environments/environment.prod.ts` must be configured before building (it is git-ignored):

```typescript
export const environment = {
  production:          true,
  clerkPublishableKey: 'pk_live_...',
  apiUrl:              'https://<cloud-run-service-url>',
};
```

> In CI, generate this file from secrets before the build step (see the existing GitHub Actions workflow for reference).

---

## Testing

Tests use **Vitest 4** via `@angular/build:unit-test`. Test files live next to the source they test (`*.spec.ts`).

```bash
npm test          # run all tests once
```

Test utilities used:

- `TestBed` + `provideHttpClientTesting()` for service tests — requests are intercepted with `HttpTestingController`
- `ComponentFixture` for component tests — rendered in a minimal DOM via jsdom
- `vi.fn()` / `vi.useFakeTimers()` for mocking Vitest globals

---

## Environment Variables Reference

Both values are set inside `src/environments/environment.ts` (not in `.env`):

| Key | Description |
|---|---|
| `production` | `true` for production builds, `false` for development |
| `clerkPublishableKey` | Clerk publishable key (`pk_test_...` or `pk_live_...`) |
| `apiUrl` | Base URL of the backend API (e.g. `http://localhost:3000`) |

In CI, the environment file is generated from GitHub secrets before the build step.
