# Setup

1. Copy the env file:
   ```
   cp .env.example .env
   ```

2. Build the backend image:
   ```
   docker compose build backend
   ```

3. Run migrations:
   ```
   scripts/migrate.sh
   ```

4. Start the dev server:
   ```
   docker compose up backend
   ```

   The app will be available at `http://localhost:8000`.

5. (Optional) Create an admin superuser:
   ```
   scripts/createsuperuser.sh
   ```

# Migrations

- **Adding a migration** (after changing a model), dev only:
  ```
  scripts/makemigrations.sh
  ```
  Review the generated migration file, then commit it to git.

- **Running migrations** (dev):
  ```
  scripts/migrate.sh
  ```

- **Running migrations** (prod):
  ```
  scripts/migrate.sh compose.prod.yml
  ```

- **Rolling back a migration**:
  ```
  scripts/rollback.sh <app_label> <migration_name> [compose_file]
  ```
  Example: `scripts/rollback.sh main 0003_previous_migration`
