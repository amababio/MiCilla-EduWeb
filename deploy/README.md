# MiCilla EduWeb — VPS deployment

Deploy the app on a Linux VPS (Ubuntu 22.04+ recommended) with PostgreSQL, Caddy, HTTPS, and daily backups.

## What you need

- A VPS with root SSH access
- A domain name pointed to the VPS (A record)
- Node.js 20+ and npm
- Docker (for PostgreSQL on the same server)
- Caddy (automatic HTTPS) **or** Nginx + Certbot

## 1. Prepare the server

```bash
# Example packages on Ubuntu
sudo apt update
sudo apt install -y git curl docker.io docker-compose-plugin caddy postgresql-client

# Node 20 via NodeSource (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

sudo useradd -m -s /bin/bash deploy || true
sudo mkdir -p /var/www/micilla-eduweb
sudo chown deploy:deploy /var/www/micilla-eduweb
```

## 2. Clone the app

```bash
sudo -u deploy git clone <your-repo-url> /var/www/micilla-eduweb
cd /var/www/micilla-eduweb
sudo -u deploy cp .env.example .env
# Edit .env — set DATABASE_URL, SESSION_SECRET, DEFAULT_SCHOOL_SLUG
sudo -u deploy nano .env
```

Generate a strong session secret:

```bash
openssl rand -base64 48
```

## 3. Start production PostgreSQL

On the VPS, set database credentials then start the container (localhost only):

```bash
export POSTGRES_PASSWORD='your-strong-db-password'
docker compose -f deploy/docker-compose.prod.yml up -d
```

Set `DATABASE_URL` in `.env`:

```text
postgresql://micilla:your-strong-db-password@localhost:5432/micilla_eduweb?schema=public
```

## 4. Build and migrate

```bash
sudo -u deploy bash deploy/install-app.sh
```

Do **not** run `npm run db:seed` on a live production site unless you intentionally want demo data.

Create the first real school and admin through **Super Admin** after go-live.

## 5. Run the app

### Option A — systemd (recommended)

```bash
sudo cp deploy/micilla-eduweb.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now micilla-eduweb
sudo systemctl status micilla-eduweb
```

### Option B — PM2

```bash
sudo npm install -g pm2
cd /var/www/micilla-eduweb
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup
```

## 6. HTTPS with Caddy

```bash
sudo cp deploy/Caddyfile.example /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile   # replace your-school-domain.com
sudo systemctl reload caddy
```

Caddy obtains and renews Let's Encrypt certificates automatically.

## 7. Verify

```bash
curl -s http://127.0.0.1:3000/api/health
curl -sI https://your-school-domain.com
npm run test:smoke   # with BASE_URL=https://your-school-domain.com
```

## 8. Backups

Install a daily cron job as root or deploy:

```bash
chmod +x deploy/backup-db.sh
sudo crontab -e
```

Add:

```cron
0 2 * * * /var/www/micilla-eduweb/deploy/backup-db.sh >> /var/log/micilla-backup.log 2>&1
```

Backups are written to `BACKUP_DIR` (default `/var/backups/micilla-eduweb`).

## 9. Updates (new releases)

```bash
cd /var/www/micilla-eduweb
sudo -u deploy git pull
sudo -u deploy bash deploy/install-app.sh
sudo systemctl restart micilla-eduweb
# or: pm2 restart micilla-eduweb
```

## Environment variables

See `.env.example` for the full list. Production minimum:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection |
| `SESSION_SECRET` | Signs admin session cookies |
| `DEFAULT_SCHOOL_SLUG` | School shown at `/` |
| `NODE_ENV` | Set to `production` |
| `PORT` | App port (default 3000) |

## Troubleshooting

| Issue | Check |
|-------|--------|
| 502 from Caddy | `systemctl status micilla-eduweb`, app listening on 3000 |
| Admin login fails | `SESSION_SECRET` set, HTTPS enabled (secure cookies) |
| Database errors | `docker ps`, `DATABASE_URL`, run `npm run db:migrate:deploy` |
| Stale pages after edit | ISR revalidate is 5 minutes; restart app for immediate refresh |
