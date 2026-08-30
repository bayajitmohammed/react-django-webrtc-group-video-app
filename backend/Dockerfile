# --- Base: shared by dev and prod ---
FROM python:3.13-slim AS base

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# --- Development ---
FROM base AS dev

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# --- Production ---
FROM base AS prod

ENV DEBUG=False

CMD ["gunicorn", "config.asgi:application", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--workers", "3"]
