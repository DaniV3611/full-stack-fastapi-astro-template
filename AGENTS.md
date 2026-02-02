# AGENTS.md - AI Coding Agent Instructions

This is a full-stack FastAPI + React template with a Python backend and TypeScript frontend.

## Project Structure

```
/
├── backend/           # FastAPI Python backend
│   ├── app/           # Application code
│   │   ├── api/       # API routes and dependencies
│   │   ├── core/      # Config, security, database
│   │   ├── alembic/   # Database migrations
│   │   ├── models.py  # SQLModel models + Pydantic schemas
│   │   └── crud.py    # Database CRUD operations
│   ├── tests/         # Pytest tests
│   └── scripts/       # Shell scripts (test.sh, lint.sh, format.sh)
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── client/    # Auto-generated API client (DO NOT EDIT)
│   │   ├── components/
│   │   │   └── ui/    # shadcn/ui components (DO NOT EDIT)
│   │   ├── hooks/     # Custom React hooks
│   │   └── routes/    # TanStack Router file-based routes
│   └── tests/         # Playwright E2E tests
└── scripts/           # Root-level scripts
```

## Build/Lint/Test Commands

### Backend (Python/FastAPI)

Working directory: `backend/`

```bash
# Run all tests with coverage
uv run bash scripts/test.sh

# Run a single test file
uv run pytest tests/api/routes/test_items.py -v

# Run a single test function
uv run pytest tests/api/routes/test_items.py::test_create_item -v

# Run tests matching a pattern
uv run pytest -k "test_create" -v

# Lint (type check + ruff)
uv run bash scripts/lint.sh

# Format code
uv run bash scripts/format.sh

# Start dev server
uv run fastapi dev app/main.py
```

### Frontend (React/TypeScript)

Working directory: `frontend/` (or root with bun workspaces)

```bash
# Run all Playwright tests
bun run test

# Run a single test file
bunx playwright test tests/items.spec.ts

# Run tests matching a pattern
bunx playwright test --grep "create item"

# Run tests with UI
bun run test:ui

# Lint and auto-fix
bun run lint

# Build
bun run build

# Generate API client from backend OpenAPI
bun run generate-client

# Start dev server
bun run dev
```

### Docker Compose (Full Stack)

```bash
# Start the full stack with hot reload
docker compose watch

# Run all tests in containers
./scripts/test.sh
```

## Code Style Guidelines

### Backend (Python)

**Formatting & Linting:**
- Formatter: Ruff (line length not enforced)
- Linter: Ruff + mypy (strict mode)
- Target: Python 3.10+

**Import Order:**
1. Standard library (`uuid`, `typing`, `datetime`)
2. Third-party (`fastapi`, `sqlmodel`, `pydantic`)
3. Local app imports (`app.api.deps`, `app.models`, `app.core`)

**Naming Conventions:**
- Functions: `snake_case` (`get_user_by_email`, `create_item`)
- Classes: `PascalCase` (`UserCreate`, `ItemPublic`)
- Type aliases: `PascalCase` with `Annotated` (`CurrentUser`, `SessionDep`)
- Database models: Singular nouns (`User`, `Item`)
- API schemas: `{Model}Create`, `{Model}Update`, `{Model}Public`, `{Model}sPublic`

**Type Annotations:**
- Full type hints required on all functions
- Use modern union syntax: `str | None` (not `Optional[str]`)
- Use `Annotated` for dependency injection
- Route handlers may return `Any`

**Error Handling:**
- Raise `HTTPException` directly with appropriate status codes
- Use clear, user-friendly error messages
- Common codes: 400 (bad request), 403 (forbidden), 404 (not found), 409 (conflict)

**Example:**
```python
from typing import Any
from fastapi import APIRouter, HTTPException
from sqlmodel import select
from app.api.deps import CurrentUser, SessionDep
from app.models import Item, ItemCreate, ItemPublic

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=ItemPublic)
def create_item(*, session: SessionDep, current_user: CurrentUser, item_in: ItemCreate) -> Any:
    item = Item.model_validate(item_in, update={"owner_id": current_user.id})
    session.add(item)
    session.commit()
    session.refresh(item)
    return item
```

### Frontend (TypeScript/React)

**Formatting & Linting:**
- Formatter: Biome (spaces, double quotes, semicolons only when needed)
- Linter: Biome with recommended rules
- TypeScript: Strict mode enabled

**Import Order:**
1. External packages (`react`, `@tanstack/*`, `zod`)
2. Internal imports using `@/` alias (`@/client`, `@/components/*`, `@/hooks/*`)

**Naming Conventions:**
- Components: `PascalCase` files and names (`AddItem.tsx`, `UserSettings.tsx`)
- Hooks: `camelCase` with `use` prefix (`useAuth.ts`, `useCustomToast.ts`)
- Utilities: `camelCase` (`utils.ts`)
- Types/Interfaces: `PascalCase`

**Component Patterns:**
- Functional components only
- React Hook Form + Zod for form validation
- TanStack Query for server state (`useQuery`, `useMutation`, `useSuspenseQuery`)
- Query invalidation after mutations

**Error Handling:**
```typescript
const mutation = useMutation({
  mutationFn: (data: ItemCreate) => ItemsService.createItem({ requestBody: data }),
  onSuccess: () => showSuccessToast("Item created"),
  onError: handleError.bind(showErrorToast),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
})
```

**Do Not Edit:**
- `src/client/**` - Auto-generated from OpenAPI
- `src/components/ui/**` - shadcn/ui components
- `src/routeTree.gen.ts` - Auto-generated routes

## Database Migrations

```bash
# Create a new migration (from backend/)
uv run alembic revision --autogenerate -m "description"

# Apply migrations
uv run alembic upgrade head

# Rollback one migration
uv run alembic downgrade -1
```

## API Client Generation

After modifying backend API endpoints:
```bash
# Backend must be running for OpenAPI spec
cd frontend && bun run generate-client
```

## Testing Patterns

**Backend (pytest):**
- Fixtures defined in `conftest.py`
- Use `client` fixture for API testing
- Use `superuser_token_headers` for authenticated requests

**Frontend (Playwright):**
- E2E tests in `frontend/tests/`
- Helper utilities in `tests/utils/`
- Auth state stored via `auth.setup.ts`
