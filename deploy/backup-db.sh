#!/usr/bin/env bash
# Daily PostgreSQL backup for MiCilla EduWeb.
# Requires pg_dump and a DATABASE_URL in .env (or environment).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT/.env}"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set. Add it to $ENV_FILE" >&2
  exit 1
fi

BACKUP_DIR="${BACKUP_DIR:-/var/backups/micilla-eduweb}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="$BACKUP_DIR/micilla-eduweb-$STAMP.sql.gz"

mkdir -p "$BACKUP_DIR"
pg_dump "$DATABASE_URL" | gzip > "$TARGET"
find "$BACKUP_DIR" -name "micilla-eduweb-*.sql.gz" -mtime +"$RETENTION_DAYS" -delete

echo "Backup saved to $TARGET"
