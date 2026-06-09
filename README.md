# MiCilla EduWeb

Reusable school website platform for private basic schools in Ghana.

## Current Phase

Phase 2 — Database and Prisma

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

## Useful Database Commands

```bash
npm run db:studio   # Open Prisma Studio
npm run db:seed     # Re-seed demo school data
npm run db:down     # Stop PostgreSQL container
```

## Development Rule

This project must be built phase by phase. Do not add future-phase features before approval.
