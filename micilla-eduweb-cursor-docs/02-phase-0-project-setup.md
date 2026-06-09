# 02 — Phase 0: Project Setup

## Goal

Set up the technical foundation for MiCilla EduWeb.

Do not build school website features yet.

This phase is only for creating the project foundation.

---

# Required Stack

Use:

- Next.js
- TypeScript
- Tailwind CSS
- ESLint
- Git
- Beginner-friendly folder structure

Do not add Prisma or PostgreSQL yet unless explicitly instructed later.

Database starts in Phase 2.

---

# Current Phase Scope

Allowed in this phase:

- Create Next.js project
- Add TypeScript
- Add Tailwind CSS
- Set up basic folders
- Create simple placeholder homepage
- Add project README
- Confirm app runs locally
- Initialize Git if not already initialized

Not allowed in this phase:

- Database
- Prisma
- Admin login
- Admin dashboard
- Multi-school routing
- File uploads
- Timetable features
- Deployment
- Authentication
- Payment features
- Parent portal
- Student portal
- SMS/WhatsApp automation

---

# Recommended Project Name

Use:

```txt
micilla-eduweb
```

---

# Setup Commands

If starting from scratch, use:

```bash
npx create-next-app@latest micilla-eduweb
```

Recommended selections:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: Yes
App Router: Yes
Turbopack: Optional
Import alias: Yes
```

Recommended import alias:

```txt
@/*
```

Then:

```bash
cd micilla-eduweb
npm run dev
```

---

# Suggested Folder Structure

Create or prepare this structure:

```txt
src/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    public-site/
    shared/
  lib/
  data/
  types/
```

Explanation:

- `components/public-site/` will hold public school website components.
- `components/shared/` will hold reusable UI components.
- `data/` can hold demo content for Phase 1.
- `types/` can hold TypeScript types later.
- `lib/` can hold utility functions later.

Do not overbuild the structure.

---

# Placeholder Homepage

Create a simple placeholder homepage that says:

```txt
MiCilla EduWeb
Professional websites for private schools.
```

Add a note:

```txt
Phase 0 setup complete.
```

This placeholder will be replaced in Phase 1.

---

# README Requirements

Create or update `README.md` with:

- Project name
- Short description
- Stack
- How to run locally
- Current phase
- Development rule: build phase by phase

Suggested README content:

```md
# MiCilla EduWeb

Reusable school website platform for private basic schools in Ghana.

## Current Phase

Phase 0 — Project Setup

## Stack

- Next.js
- TypeScript
- Tailwind CSS

## Run Locally

```bash
npm install
npm run dev
```

## Development Rule

This project must be built phase by phase. Do not add future-phase features before approval.
```

---

# Testing Steps

After implementation, run:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Expected result:

- App loads successfully.
- Placeholder homepage appears.
- No console errors.
- Tailwind styles work.

Also run:

```bash
npm run lint
```

Expected result:

- No lint errors.

If `npm run build` is available and fast enough, run:

```bash
npm run build
```

Expected result:

- Build completes successfully.

---

# Acceptance Criteria

Phase 0 is complete when:

- Next.js app exists.
- TypeScript is enabled.
- Tailwind CSS works.
- Placeholder homepage appears.
- Suggested folder structure exists.
- README is updated.
- `npm run dev` works.
- `npm run lint` passes.
- No school-specific features are built yet.

---

# Stop Point

Stop after project setup is working.

Do not start Phase 1 until instructed.

---

# Suggested Git Commit Message

```txt
chore: initialize MiCilla EduWeb project
```

---

# Cursor Completion Response Format

At the end, report:

```txt
Phase 0 complete.

Files created/changed:
- ...

How to test:
- ...

Expected result:
- ...

Known limitations:
- No public demo website yet.
- No database yet.
- No admin dashboard yet.

Suggested commit:
chore: initialize MiCilla EduWeb project
```
