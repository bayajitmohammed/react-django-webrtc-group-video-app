#!/usr/bin/env bash
# Create a Django admin superuser interactively. Dev only.
set -euo pipefail

docker compose run --rm backend python manage.py createsuperuser
