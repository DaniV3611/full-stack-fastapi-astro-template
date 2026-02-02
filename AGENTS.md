# AGENTS.md - AI Coding Agent Instructions

Full-stack FastAPI + React template with Python backend and TypeScript frontend.

## Project Structure

```
backend/                 # FastAPI Python backend
├── app/
│   ├── api/             # Routes (routes/) and dependencies (deps.py)
│   ├── core/            # Config, security, database
│   ├── alembic/         # Database migrations
│   ├── models.py        # SQLModel models + Pydantic schemas
│   └── crud.py          # Database CRUD operations
├── tests/               # Pytest tests
└── scripts/             # test.sh, lint.sh, format.sh

frontend/                # React TypeScript frontend
├── src/
│   ├── client/          # Auto-generated API client (DO NOT EDIT)
│   ├── components/ui/   # shadcn/ui components (DO NOT EDIT)
│   ├── hooks/           # Custom React hooks
│   └── routes/          # TanStack Router file-based routes
└── tests/               # Playwright E2E tests
```

## Build/Lint/Test Commands

### Backend (working directory: `backend/`)

```bash
uv run bash scripts/test.sh                              # Run all tests with coverage
uv run pytest tests/api/routes/test_users.py -v          # Single test file
uv run pytest tests/api/routes/test_users.py::test_get_users_superuser_me -v  # Single test
uv run pytest -k "test_create" -v                        # Tests matching pattern

uv run bash scripts/lint.sh                              # Lint (mypy + ruff)
uv run bash scripts/format.sh                            # Format code
uv run fastapi dev app/main.py                           # Start dev server
```

### Frontend (working directory: `frontend/`)

```bash
bun run test                                             # Run all Playwright tests
bunx playwright test tests/login.spec.ts                 # Single test file
bunx playwright test --grep "create item"                # Tests matching pattern
bun run test:ui                                          # Tests with UI

bun run lint                                             # Lint and auto-fix (Biome)
bun run build                                            # Build for production
bun run generate-client                                  # Generate API client from OpenAPI
bun run dev                                              # Start dev server
```

### Docker Compose

```bash
docker compose watch                                     # Start full stack with hot reload
./scripts/test.sh                                        # Run all tests in containers
```

## Code Style Guidelines

### Backend (Python)

**Formatting & Linting:**
- Ruff for formatting and linting, mypy strict mode for type checking
- Target: Python 3.10+

**Import Order:**
1. Standard library (`uuid`, `typing`, `collections.abc`)
2. Third-party (`fastapi`, `sqlmodel`, `pydantic`)
3. Local imports (`app.api.deps`, `app.models`, `app.core`)

**Naming Conventions:**
- Functions/variables: `snake_case`
- Classes: `PascalCase`
- Type aliases: `PascalCase` with `Annotated` (`CurrentUser`, `SessionDep`)
- Database models: Singular (`User`, `Item`)
- API schemas: `{Model}Create`, `{Model}Update`, `{Model}Public`, `{Model}sPublic`

**Type Annotations:**
- Full type hints required on all functions
- Use `str | None` (not `Optional[str]`)
- Use `Annotated` for dependency injection
- Route handlers return `Any`

**Error Handling:**
- Raise `HTTPException` with codes: 400 (bad request), 403 (forbidden), 404 (not found), 409 (conflict)

**Example Route:**
```python
from typing import Any
from fastapi import APIRouter, HTTPException
from app.api.deps import CurrentUser, SessionDep
from app.models import User, UserCreate, UserPublic

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserPublic)
def create_user(*, session: SessionDep, current_user: CurrentUser, user_in: UserCreate) -> Any:
    user = User.model_validate(user_in, update={"owner_id": current_user.id})
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
```

### Frontend (TypeScript/React)

**Formatting & Linting:**
- Biome: spaces, double quotes, semicolons only as needed
- TypeScript strict mode enabled

**Import Order:**
1. External packages (`react`, `@tanstack/*`, `zod`)
2. Internal imports using `@/` alias (`@/client`, `@/components/*`, `@/hooks/*`)

**Naming Conventions:**
- Components: `PascalCase` files (`AddUser.tsx`)
- Hooks: `camelCase` with `use` prefix (`useAuth.ts`)
- Types/Interfaces: `PascalCase`

**Component Patterns:**
- Functional components only
- React Hook Form + Zod for form validation
- TanStack Query for server state
- Invalidate queries after mutations

**Example Mutation:**
```typescript
const mutation = useMutation({
  mutationFn: (data: UserCreate) => UsersService.createUser({ requestBody: data }),
  onSuccess: () => showSuccessToast("User created"),
  onError: handleError.bind(showErrorToast),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
})
```

**Do Not Edit:**
- `src/client/**` - Auto-generated from OpenAPI
- `src/components/ui/**` - shadcn/ui components
- `src/routeTree.gen.ts` - Auto-generated routes

## Database Migrations

Migrations must be run via Docker Compose to access the database:

```bash
docker compose exec backend alembic revision --autogenerate -m "description"  # Create migration
docker compose exec backend alembic upgrade head                              # Apply migrations
docker compose exec backend alembic downgrade -1                              # Rollback one
```

## API Client Generation

After modifying backend API endpoints:
```bash
# Backend must be running
cd frontend && bun run generate-client
```

## Testing Patterns

**Backend (pytest):**
- Fixtures in `conftest.py`: `db`, `client`, `superuser_token_headers`, `normal_user_token_headers`
- Use `client` fixture for API testing
- Mock external services with `unittest.mock.patch`

**Frontend (Playwright):**
- E2E tests in `frontend/tests/`
- Utilities in `tests/utils/`
- Auth state via `auth.setup.ts`
