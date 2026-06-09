#!/usr/bin/env bash
# Build MiCilla EduWeb on a VPS after cloning or pulling latest code.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
  echo "Missing .env file. Copy .env.example and set production values first." >&2
  exit 1
fi

echo "Installing dependencies..."
npm ci

echo "Generating Prisma client..."
npx prisma generate

echo "Applying database migrations..."
npm run db:migrate:deploy

echo "Building application..."
npm run build

echo "Done. Start with: npm start"
echo "Or enable systemd: sudo cp deploy/micilla-eduweb.service /etc/systemd/system/ && sudo systemctl enable --now micilla-eduweb"
