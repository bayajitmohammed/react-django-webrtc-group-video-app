#!/usr/bin/env bash
# Apply migrations. Defaults to dev; pass compose.prod.yml as $1 to target prod.
set -euo pipefail
COMPOSE_FILE="${1:-compose.yml}"

docker compose -f "$COMPOSE_FILE" run --rm migrate
