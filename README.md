# MiCilla EduWeb

Reusable school website platform for private basic schools in Ghana.

## Current Phase

Phase 3 — Admin Authentication

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma

## Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
npm run db:up
```

### 3. Configure environment

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

Set a strong `SESSION_SECRET` in `.env`.

### 4. Run migrations and seed

```bash
npm run db:migrate
npm run db:seed
```

### 5. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The homepage loads school content from PostgreSQL (seeded with Redemption International School).

## Admin Sign In (Phase 3)

- Login page: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Protected dashboard: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

Default seeded admin (change after first login in a later phase):

- Email: `admin@redemptioninternationalschool.edu.gh`
- Password: `Admin123!`

## Useful Database Commands

```bash
npm run db:studio   # Open Prisma Studio
npm run db:seed     # Re-seed demo school and admin data
npm run db:down     # Stop PostgreSQL container
```

## Development Rule

This project must be built phase by phase. Do not add future-phase features before approval.
