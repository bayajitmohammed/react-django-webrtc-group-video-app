#!/usr/bin/env bash
# Run a one-off command inside the frontend container. Dev only.
# Usage: scripts/frontend.sh <command> [args...]
# Examples:
#   scripts/frontend.sh bun add zustand
#   scripts/frontend.sh bunx shadcn@latest add button
#   scripts/frontend.sh bun run lint
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <command> [args...]" >&2
  exit 1
fi

docker compose run --rm frontend "$@"
