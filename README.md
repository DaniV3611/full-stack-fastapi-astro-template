# Full Stack FastAPI Template (Customized)

> **Note:** This is a customized fork of the official [Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template). See the [Changes from Original Template](#changes-from-original-template) section for details.

## Technology Stack and Features

- ⚡ [**FastAPI**](https://fastapi.tiangolo.com) for the Python backend API.
  - 🧰 [SQLModel](https://sqlmodel.tiangolo.com) for the Python SQL database interactions (ORM).
  - 🔍 [Pydantic](https://docs.pydantic.dev), used by FastAPI, for the data validation and settings management.
  - 💾 [PostgreSQL](https://www.postgresql.org) as the SQL database.
- 🚀 [React](https://react.dev) for the frontend.
  - 💃 Using TypeScript, hooks, [Vite](https://vitejs.dev), and other parts of a modern frontend stack.
  - 🎨 [Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com) for the frontend components.
  - 🤖 An automatically generated frontend client.
  - 🧪 [Playwright](https://playwright.dev) for End-to-End testing.
  - 🦇 Dark mode support.
- 🐋 [Docker Compose](https://www.docker.com) for development and production.
- 🔒 Secure password hashing by default.
- 🔑 JWT (JSON Web Token) authentication.
- 📫 Email based password recovery.
- 📬 [Mailcatcher](https://mailcatcher.me) for local email testing during development.
- ✅ Tests with [Pytest](https://pytest.org).
- 📞 [Traefik](https://traefik.io) as a reverse proxy / load balancer.
- 🚢 Deployment instructions using Docker Compose, including how to set up a frontend Traefik proxy to handle automatic HTTPS certificates.

### Dashboard Login

[![API docs](img/login.png)](https://github.com/DaniV3611/full-stack-fastapi-react-template)

### Dashboard - Admin

[![API docs](img/dashboard.png)](https://github.com/DaniV3611/full-stack-fastapi-react-template)

### Dashboard - Dark Mode

[![API docs](img/dashboard-dark.png)](https://github.com/DaniV3611/full-stack-fastapi-react-template)

### Interactive API Documentation

[![API docs](img/docs.png)](https://github.com/DaniV3611/full-stack-fastapi-react-template)

## Changes from Original Template

This fork includes the following modifications from the [original FastAPI template](https://github.com/fastapi/full-stack-fastapi-template):

### Removed Features
- **Items feature removed** - The example "Items" CRUD functionality has been removed from both the backend API and frontend UI, providing a cleaner starting point for your own models
- **GitHub Actions removed** - CI/CD workflows have been removed to allow you to set up your own pipeline

### Added Features
- **AGENTS.md** - Added AI coding agent instructions for tools like GitHub Copilot, Cursor, and other AI assistants to better understand the codebase

### Configuration Changes
- **Environment variables** - `.env` is now gitignored; use `.env.example` as a template
- **Branch naming** - Default branch references changed from `master` to `main`
- **Simplified Docker Compose** - Streamlined configuration for easier development

---

## How To Use It

You can **just fork or clone** this repository and use it as is.

```bash
git clone git@github.com:DaniV3611/full-stack-fastapi-react-template.git my-project
cd my-project
cp .env.example .env  # Copy and configure your environment variables
```

### Update From the Original Template

If you want to pull updates from the original FastAPI template:

```bash
# Add the original template as upstream (one-time setup)
git remote add upstream git@github.com:fastapi/full-stack-fastapi-template.git

# Pull latest changes
git pull --no-commit upstream master
```

**Note:** Since this fork has removed some features, you may encounter conflicts when merging updates from the original template.

### Configure

You can update configs in the `.env` file to customize your configurations.

Before deploying it, make sure you change at least the values for:

- `SECRET_KEY`
- `FIRST_SUPERUSER_PASSWORD`
- `POSTGRES_PASSWORD`

You can (and should) pass these as environment variables from secrets.

Read the [deployment.md](./deployment.md) docs for more details.

### Generate Secret Keys

Some environment variables in the `.env` file have a default value of `changethis`.

You have to change them with a secret key, to generate secret keys you can run the following command:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the content and use that as password / secret key. And run that again to generate another secure key.

## Backend Development

Backend docs: [backend/README.md](./backend/README.md).

## Frontend Development

Frontend docs: [frontend/README.md](./frontend/README.md).

## Deployment

Deployment docs: [deployment.md](./deployment.md).

## Development

General development docs: [development.md](./development.md).

This includes using Docker Compose, custom local domains, `.env` configurations, etc.

## Release Notes

Check the file [release-notes.md](./release-notes.md).

## License

The Full Stack FastAPI Template is licensed under the terms of the MIT license.

## Acknowledgements

This project is a customized fork of the [Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template) by [@tiangolo](https://github.com/tiangolo) and the FastAPI team.
