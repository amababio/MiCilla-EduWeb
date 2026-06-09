# MiCilla EduWeb

Reusable school website platform for private basic schools in Ghana.

## Current Phase

Phase 14 — Optional Schedule Module

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

## Programs (Phase 7)

- Edit page: [http://localhost:3000/admin/programs](http://localhost:3000/admin/programs)

Admins can add, edit, hide, reorder, and remove school programs. Optional photo links appear on the public Programs section.

## Photos (Phase 8)

- Edit page: [http://localhost:3000/admin/photos](http://localhost:3000/admin/photos)

Admins can add photo links, set categories, mark featured photos, reorder, and remove items. Featured photos appear in the homepage gallery preview.

## Achievements (Phase 9)

- Edit page: [http://localhost:3000/admin/achievements](http://localhost:3000/admin/achievements)

Admins can add BECE results, competitions, awards, and innovation entries. Privacy display options control how student names appear publicly. Published achievements update the homepage Excellence section.

## Notices (Phase 10)

- Edit page: [http://localhost:3000/admin/notices](http://localhost:3000/admin/notices)

Admins can add, edit, publish, reorder, and remove school announcements. Categories include admissions, events, academics, PTA, and more. Published notices appear on the public homepage.

## Files (Phase 11)

- Edit page: [http://localhost:3000/admin/files](http://localhost:3000/admin/files)

Admins can add file links for admission forms, prospectus, book lists, and fee notices. Published files appear in the public Downloads section and the admissions form button when linked.

## Multi-School Public Sites (Phase 12)

- Default homepage: [http://localhost:3000/](http://localhost:3000/) (uses `DEFAULT_SCHOOL_SLUG` from `.env`)
- School by slug: [http://localhost:3000/schools/redemption-international-school](http://localhost:3000/schools/redemption-international-school)
- Second demo school: [http://localhost:3000/schools/grace-basic-school](http://localhost:3000/schools/grace-basic-school)

Each school loads its own content from PostgreSQL. Admin **Preview Website** opens the signed-in school's public page.

Seeded demo admins:

- Redemption: `admin@example.com` / `admin123!` (or your `.env` values)
- Grace Basic School: `grace-admin@example.com` / `admin123!`

## MiCilla Super Admin (Phase 13)

- Login: [http://localhost:3000/super-admin/login](http://localhost:3000/super-admin/login)
- Dashboard: [http://localhost:3000/super-admin/dashboard](http://localhost:3000/super-admin/dashboard)

MiCilla staff can create schools, create school admins, reset admin passwords, activate/deactivate public websites, and view all schools.

Default seeded super admin:

- `super@micilla.com` / `super123!` (or your `SEED_SUPER_ADMIN_*` values in `.env`)

## Schedule (Phase 14)

- Edit page: [http://localhost:3000/admin/schedule](http://localhost:3000/admin/schedule)

Admins can manage classes, subjects/activities, class timetables, exam timetables, term calendar events, and daily routines for crèche/KG. Published schedule items appear in the public Schedule section on the homepage.

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
