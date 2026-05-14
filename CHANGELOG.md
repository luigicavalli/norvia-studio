# CHANGELOG

All notable changes to this project will be documented in this file.

## [Unreleased]

## [2.0.0] - 2026-05-15

### Added

- **Internationalisation (i18n)** — full Italian / English support via `@ngx-translate/core` v17 + `@ngx-translate/http-loader` v17; translation files served as static JSON from `/public/i18n/`
- **Language preference** — authenticated users store their preferred language in Clerk `unsafeMetadata`; unauthenticated users (login page) fall back to `navigator.language`; changing the language from Settings reloads the app so all `instant()`-computed values are refreshed
- **Language switcher** — Settings page now exposes a language selector (Italiano / English) that persists the choice to Clerk and reloads
- **Translated pages** — all feature pages fully translated: Index/Login, Home, Projects, Clients, Companies, Team, Quotes, Invoices, Account, Settings, Sidebar, and Shell onboarding overlay
- **Bootstrap guard** — a single `provideAppInitializer` initialiser sequentially runs `auth.init()` then `translate.use(lang)`, ensuring translations are loaded before any component renders; the auth interceptor skips `/i18n/` requests to prevent a deadlock
- **Locale-aware date formatting** — `formatDate()` in Quotes and Invoices now selects `en-GB` or `it-IT` based on the active language

### Fixed

- **Index component spec** — `TestBed` was missing a `TranslateService` provider after the component gained i18n support; added a mock with Italian translations for all keys used by the component; replaced brittle `app-button[label="..."]` attribute selectors (broken by property binding) with structural selectors

## [1.3.0] - 2026-05-10

### Added

- **Fatture (Invoices) — backend** — full Clean Architecture implementation: `Invoice` and `InvoiceItem` domain models, `InvoiceRepository` with batch assembly (no N+1), 7 use cases (`GetByWorkspace`, `GetByClient`, `GetById`, `Create`, `Update`, `UpdateStatus`, `Delete`), DTO/converter/controller layer, and 7 routes (`GET|POST /invoices`, `GET|PUT|DELETE /invoices/:id`, `PATCH /invoices/:id/status`, `GET /clients/:id/invoices`)
- **Fatture (Invoices) — frontend** — full page with 8-column table, FormArray line-items modal, contextual dropdown actions (DRAFT→SENT, SENT/OVERDUE→PAID, cancellation), `InvoiceService` with signal state, `total()`, and `nextNumber()`; wired into sidebar navigation and shell boot sequence
- **Preventivi (Quotes) — frontend** — same full-page implementation as invoices: FormArray modal, status transitions (DRAFT→SENT, SENT→ACCEPTED/REJECTED/EXPIRED), `QuoteService` with `total()` and `nextNumber()`
- **Dashboard widgets** — "Fatture in sospeso" and "Preventivi recenti" two-column widget grid on the home page; invoices sorted by due date with overdue (red) and ≤7-day (yellow) indicators; zero extra network requests (derives from preloaded signal state)
- **Dashboard stat cards expanded** — added "Da incassare" (outstanding invoice total) and "Prev. in bozza" (draft quote count) to the 6-card stat grid; stat grid now uses a responsive 6→3→2 column layout
- **Team inline role change** — owners and superadmins can change a member's role directly from the team page via a styled pill `<select>`; calls `PUT /api/workspaces/:id/members/:memberId`; non-modifiable roles (owner, superadmin) render as a plain badge

### Fixed

- **Quotes dropdown clipped** — `.quotes__table-wrap` had `overflow-x: auto` which created a scroll container that clipped the absolutely-positioned row dropdown; changed to `overflow: visible`
- **Quotes dropdown button text alignment** — `all: unset` on `<button>` removes `text-align`; added `text-align: left` explicitly to `.quotes__dropdown-item`
- **`quote.service.ts` lint error** — inner `.map()` callback was typed as `(i: any)`, not covered by the surrounding `eslint-disable-next-line`; retyped as `(i: QuoteItem)`
- **Home template `TS2341`** — `invoiceService` and `quoteService` were declared `private` but accessed in the template via `invoiceService.total()` and `quoteService.total()`; changed to `protected`

## [1.2.0] - 2026-05-09

### Added

- **Multi-workspace support** — workspace switcher in the sidebar lets users switch between workspaces; a dedicated modal allows creating new workspaces directly from the dropdown without leaving the current page
- **Companies feature** — full CRUD for companies (aziende): dedicated page with card grid, search by name/city/P.IVA/email, create/edit/delete modal
- **Company selector in client form** — when creating or editing a client, an optional company dropdown links the client to an existing company
- **`POST /api/members/activate-self`** — idempotent endpoint that activates a pending team-member record for already-registered Clerk users; called at shell boot to handle invitations accepted by existing users (the `user.created` webhook only fires for new registrations)
- **`GET|POST|PUT|DELETE /api/companies`** and **`GET /api/companies/:id/clients`** — company CRUD endpoints, now fully functional after fixing the missing `workspaceId` in `CompanyDTO`
- **Team member names** — `first_name` and `last_name` columns added to `team_members` table; values are fetched from Clerk at invite/create time and propagated through all layers (PO → BO → DTO → frontend model)
- **`VIEWER` role** — added to the `team_member_role` enum and frontend `MemberRole` type
- **Team skeleton loading** — shimmer placeholder rows shown while team members are loading for the first time
- **Delete account** — account page now has a working "Elimina account" button protected by an email-confirmation modal; calls `clerk.user.delete()` and redirects to the landing page

### Fixed

- **Team count bug** — "N membri nel workspace" was double-counting: the current user appeared in both the hardcoded row and the `activeMembers` loop because `owner.email` was stored as `null`; fixed in `CreateWorkspaceUseCase` and `AddTeamMemberUseCase` (email now fetched from Clerk)
- **Team member filtering** — `activeMembers` and `currentUserRole` now filter by `userId` instead of `email`, avoiding false positives when email is not yet populated
- **`CompanyDTO` missing `workspaceId`** — `CompanyDTOConverter` and `CompanyPOConverter` both failed to set `company.workspace`; creating a company via the API would have thrown a runtime error; both converters now correctly hydrate the `Workspace` object
- **Clerk `requireAuth` deprecation** — replaced with a custom `authGuard` middleware using `getAuth(req)` from `@clerk/express`
- **Settings workspace form sync** — `ngOnInit` ran before the workspace signal was populated on page load; replaced with `effect()` in the constructor so the form patches reactively when `activeWorkspace()` resolves
- **Backend tests** — `AddTeamMemberUseCase` and `CreateWorkspaceUseCase` tests updated to inject the new `ClerkInvitationService` dependency via a mock factory; `TeamMemberDTOConverter` round-trip fixture updated with new fields

## [1.1.0] - 2026-05-03

### Added

- Sentry error tracking on backend (`@sentry/node`) and frontend (`@sentry/angular`) with user email context attached to every event
- OWASP Dependency-Check in CI pipeline (fails on CVSS ≥ 7, uploads HTML report as artifact)
- Skeleton loader cards on the dashboard to prevent flash of zero values during data fetch
- Mobile logo on the login page (visible only on small viewports)

### Fixed

- Logout button in sidebar no longer triggers the user info navigation (event bubbling resolved with `stopPropagation`)
- Spec files now read `environment.apiUrl` instead of hardcoded `localhost:3000` (prevents CI test failures after environment injection)

## [1.0.1] - 2026-05-02

### Fixed

- Redirect authenticated users away from login page
- Use explicit production configuration in Angular CI build

## [1.0.0] - 2026-05-02

### Added

- First release.

[unreleased]: https://github.com/luigicavalli/norvia-studio/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/luigicavalli/norvia-studio/compare/v1.3.0...v2.0.0
[1.3.0]: https://github.com/luigicavalli/norvia-studio/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/luigicavalli/norvia-studio/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/luigicavalli/norvia-studio/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/luigicavalli/norvia-studio/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/luigicavalli/norvia-studio/releases/tag/v1.0.0