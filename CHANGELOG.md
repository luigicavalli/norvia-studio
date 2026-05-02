# CHANGELOG

All notable changes to this project will be documented in this file.

## [Unreleased]

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

[unreleased]: https://github.com/luigicavalli/norvia-studio/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/luigicavalli/norvia-studio/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/luigicavalli/norvia-studio/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/luigicavalli/norvia-studio/releases/tag/v1.0.0