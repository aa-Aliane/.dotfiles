# Development Workflow

## Environment Setup
The project uses Docker Compose to orchestrate services:
*   **db**: PostgreSQL 16
*   **backend**: Django (runs on port 8000)
*   **frontend**: Next.js (runs on port 3000, mapped to 5173)

## Common Commands (Makefile)

The project includes a `Makefile` to simplify common development tasks. All commands are run within the Docker container context where necessary.

### Initialization
*   `make init-backend`: Full backend initialization.
    *   Creates migrations for `accounts`, `tech`, `repairs`.
    *   Applies migrations.

### Database Management
*   `make migrate`: Creates and applies database migrations.
*   `make createsuperuser`: Creates a Django admin superuser.
*   `make load-clients-data`: Loads initial client data.
*   `make load-reparations-data`: Loads initial reparation data.
*   `make generate-test-data`: Generates test data for development.

### Assets
*   `make collectstatic`: Collects static files for the backend.

### Local Environment
*   `make venv`: Creates a local Python virtual environment and installs requirements (useful for IDE autocompletion outside Docker).
*   `make clean`: Removes the local virtual environment.

## Docker Configuration
*   **Backend Volumes**:
    *   `./backend:/app` (Source code)
    *   `migrations_accounts`, `migrations_tech` (Persisted migrations)
*   **Frontend Volumes**:
    *   `./frontend:/code` (Source code)
    *   `nextjs_cache`, `turbo_cache`, `node_modules_cache` (Build performance)
