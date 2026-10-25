#!/usr/bin/env bash
set -euo pipefail

python manage.py collectstatic --noinput
python manage.py migrate --noinput
exec daphne -b 0.0.0.0 -p "${PORT:-8000}" config.asgi:application
