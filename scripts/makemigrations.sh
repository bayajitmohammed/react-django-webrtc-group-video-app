#!/usr/bin/env bash
# Generate new migration files. Dev only — never run this against prod.
set -euo pipefail

docker compose run --rm backend python manage.py makemigrations "$@"
