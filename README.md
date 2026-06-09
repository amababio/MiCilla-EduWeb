# MiCilla EduWeb

Reusable school website platform for private basic schools in Ghana.

## Current Phase

Phase 6 — Homepage Content Management

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

## Admin Sign In (Phase 3–4)

- Login page: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Dashboard: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

The dashboard includes a sidebar, summary cards, Preview Website, and Sign Out.

## School Profile (Phase 5)

- Edit page: [http://localhost:3000/admin/school-profile](http://localhost:3000/admin/school-profile)

Admins can update school name, motto, contact details, logo link, and brand color. Saving changes updates the public website.

## Homepage Content (Phase 6)

- Edit page: [http://localhost:3000/admin/homepage-content](http://localhost:3000/admin/homepage-content)

Admins can update hero message, admissions text, about section, Why Choose Us points, and contact messages. Saving changes updates the public homepage.

Default seeded admin comes from your `.env` file:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

After changing those values, run `npm run db:seed` again.

Example defaults in `.env.example`:

- Email: `admin@example.com`
- Password: `admin123!`

## Useful Database Commands

```bash
npm run db:studio   # Open Prisma Studio
npm run db:seed     # Re-seed demo school and admin data
npm run db:down     # Stop PostgreSQL container
```

## Development Rule

This project must be built phase by phase. Do not add future-phase features before approval.
