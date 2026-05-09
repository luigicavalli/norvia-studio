# CHANGELOG

All notable changes to this project will be documented in this file.

## [Unreleased]

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

[unreleased]: https://github.com/luigicavalli/norvia-studio/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/luigicavalli/norvia-studio/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/luigicavalli/norvia-studio/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/luigicavalli/norvia-studio/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/luigicavalli/norvia-studio/releases/tag/v1.0.0