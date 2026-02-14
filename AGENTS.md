# AGENTS.md - FastAPI + Astro Agent Guide
Operational guide for coding agents working in this repository.

## Rule Files (Cursor/Copilot)
Checked locations:
- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`
No Cursor/Copilot rule files are present right now.
If these files are added later, treat them as high-priority instructions.

## Repository Layout
```text
backend/
  app/
    api/                # FastAPI routers and dependencies
    core/               # Settings, DB, security
    alembic/            # Migration env + versions
    models.py           # SQLModel models and API schemas
    crud.py             # Database access helpers
  tests/                # Pytest suite
  scripts/              # lint.sh, format.sh, test.sh
frontend/
  src/pages/            # Astro routes (*.astro)
  src/components/       # React components
  src/hooks/            # React hooks
  src/client/           # Generated OpenAPI client
  tests/                # Playwright E2E tests
```

## Build, Lint, and Test Commands
### Backend (`backend/`)
```bash
uv sync
uv run fastapi dev app/main.py
uv run bash scripts/lint.sh
uv run bash scripts/format.sh
uv run bash scripts/test.sh
uv run pytest tests/api/routes/test_users.py -v
uv run pytest tests/api/routes/test_users.py::test_get_users_superuser_me -v
uv run pytest -k "test_create" -v
```

### Frontend (`frontend/`)
```bash
bun install
bun run dev
bun run build
bun run preview
bun run test
bunx playwright test tests/login.spec.ts
bunx playwright test tests/login.spec.ts -g "Log in with valid email and password"
bunx playwright test --project chromium tests/login.spec.ts
bun run test:ui
bun run generate-client
```

### Workspace root (`/`)
```bash
docker compose watch
./scripts/test.sh
uv run prek run --all-files
```

Notes:
- `frontend/package.json` currently has no dedicated `lint` script.
- Pre-commit still runs frontend lint via `npm run lint`; align scripts if this hook fails.

## Single-Test Quick Reference
- Backend single test: `uv run pytest tests/api/routes/test_users.py::test_get_users_superuser_me -v`
- Backend single file: `uv run pytest tests/api/routes/test_users.py -v`
- Backend (running stack): `docker compose exec backend bash scripts/tests-start.sh tests/api/routes/test_users.py::test_get_users_superuser_me -v`
- Frontend single file: `bunx playwright test tests/login.spec.ts`
- Frontend single test by title: `bunx playwright test tests/login.spec.ts -g "Log in with valid email and password"`

## Code Style Guidelines
### Backend (Python/FastAPI)
Formatting and linting:
- Python target is 3.10+.
- Use Ruff for lint/format and mypy in strict mode.
- Avoid `print()` in app code (`ruff` rule `T201`).

Imports:
1. Standard library (`uuid`, `datetime`, `typing`, `collections.abc`).
2. Third-party (`fastapi`, `sqlmodel`, `pydantic`, `jwt`).
3. Local (`app.api.deps`, `app.core`, `app.models`, `app.crud`).

Types and signatures:
- Add explicit type hints on all functions.
- Prefer `str | None` over `Optional[str]`.
- Use `Annotated` aliases for dependencies (`SessionDep`, `CurrentUser`, `TokenDep`).
- Route handlers typically return `Any` or explicit schema types.

Naming:
- Variables/functions: `snake_case`.
- Classes and schema models: `PascalCase`.
- Schema pattern: `UserCreate`, `UserUpdate`, `UserPublic`, `UsersPublic`.

Data and DB patterns:
- Query with SQLModel `select(...)` + `session.exec(...)`.
- For partial updates, use `model_dump(exclude_unset=True)`.
- Commit and refresh before returning modified rows.

Error handling and security:
- Raise `HTTPException` with clear `detail` messages.
- Common status codes here: 400, 403, 404, 409.
- Preserve anti-enumeration behavior in auth/recovery endpoints.

### Frontend (Astro + React + TypeScript)
Architecture:
- Astro route files are in `frontend/src/pages/*.astro`.
- React UI is in `frontend/src/components/**`, hydrated from Astro pages.
- Shared providers are composed with `AppProviders`.

Formatting and typing:
- TypeScript is strict (`astro/tsconfigs/strict`).
- Prefer explicit types for API payloads and form schemas.
- Follow existing file style (most React files use double quotes and semicolons).

Imports:
1. External packages first (`react-hook-form`, `@tanstack/react-query`, `zod`, etc.).
2. Internal alias imports second (`@/client`, `@/components`, `@/hooks`, `@/lib`).
3. Relative imports last, only when alias paths are not suitable.

Naming:
- React components/files: `PascalCase`.
- Hooks: `useXxx` in `camelCase` filenames.
- Astro route filenames: kebab-case for URL mapping.

State, forms, and API:
- Use TanStack Query for server state and mutations.
- Invalidate related queries after successful/settled mutations.
- Use React Hook Form + Zod for form validation.
- Route API calls through generated services in `@/client`.

Error handling:
- Reuse shared error extraction (`handleError`) and toast helpers.
- Show user-safe messages; do not leak backend internals in UI copy.

## Generated and Sensitive Files
Do not manually edit generated code:
- `frontend/src/client/**` (generated by `openapi-ts`).

Regenerate frontend client after backend API changes:
```bash
bash ./scripts/generate-client.sh
```

Never commit secrets:
- `.env`
- API keys, credentials, tokens

## Testing Conventions
Backend:
- Shared fixtures are in `backend/tests/conftest.py` (`db`, `client`, auth headers).
- Add tests near feature areas (`tests/api/routes/`, `tests/crud/`, etc.).
Frontend:
- Playwright tests are in `frontend/tests/`.
- Auth setup is in `frontend/tests/auth.setup.ts`.
- Prefer stable `data-testid` selectors.
