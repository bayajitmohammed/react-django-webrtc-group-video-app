#!/usr/bin/env bash
# Revert an app to an earlier migration.
# Usage: scripts/rollback.sh <app_label> <migration_name> [compose_file]
# Example: scripts/rollback.sh main 0003_previous_migration
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <app_label> <migration_name> [compose_file]" >&2
  exit 1
fi

APP="$1"
MIGRATION="$2"
COMPOSE_FILE="${3:-compose.yml}"

docker compose -f "$COMPOSE_FILE" run --rm migrate python manage.py migrate "$APP" "$MIGRATION"
