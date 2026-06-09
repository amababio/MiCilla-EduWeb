# 01 — MiCilla EduWeb Master Implementation Roadmap

## Project Summary

**MiCilla EduWeb** is a reusable school website platform for private basic schools in Ghana.

The platform focuses on:

- Publicity
- Admissions
- School branding
- Parent trust
- Gallery/photos
- Excellence & Achievements
- Announcements
- Downloads
- Contact and WhatsApp
- Optional timetable and schedule features

It is not mainly a timetable website.

---

# Build Philosophy

Build slowly and safely.

Each phase must be completed, tested, and approved before the next phase begins.

Cursor should only implement the current phase.

Cursor should not add future features early.

---

# Full Phase List

## Phase 0 — Project Setup and Rules

Set up the technical foundation.

Output:

- Next.js project
- TypeScript
- Tailwind CSS
- Basic folder structure
- Git initialized
- Clean starter app running locally

---

## Phase 1 — Public Demo School Website

Build a beautiful hardcoded public demo school website.

Output:

- Homepage
- Hero
- Admissions
- About
- Programs
- Why Choose Us
- Gallery preview
- Excellence & Achievements preview
- Announcements preview
- Downloads preview
- Contact/WhatsApp
- Footer
- Mobile responsive design

---

## Phase 2 — Database and Prisma

Add PostgreSQL and Prisma.

Output:

- Prisma schema
- School model
- Program model
- GalleryImage model
- Achievement model
- Announcement model
- Download model
- WebsiteSettings model
- Seed demo school
- Homepage reading from database

---

## Phase 3 — Admin Authentication

Add basic admin login.

Output:

- Admin login page
- Protected dashboard route
- Logout
- Password hashing
- Seed admin account

---

## Phase 4 — Admin Dashboard Shell

Build dashboard layout.

Output:

- Sidebar
- Dashboard home
- Summary cards
- Preview website button
- Logout button

---

## Phase 5 — School Profile and Branding

Allow admin to manage school identity.

Output:

- Edit school name
- Edit motto
- Edit logo
- Edit phone/WhatsApp/email/location
- Edit color
- Public site updates automatically

---

## Phase 6 — Homepage Content Management

Allow admin to manage homepage text.

Output:

- Hero title/subtitle
- Admissions message
- About text
- Why Choose Us
- CTA text
- Public homepage updates

---

## Phase 7 — Programs Management

Allow admin to manage school programs/levels.

Output:

- Add/edit/delete/deactivate programs
- Program images optional
- Public programs section updates

---

## Phase 8 — Gallery Management

Allow admin to upload and manage school photos.

Output:

- Upload photos
- Add title/category
- Mark featured
- Delete photos
- Public gallery preview updates

---

## Phase 9 — Excellence & Achievements Management

Allow admin to display performance and proof of quality.

Output:

- Add BECE/results entries
- Add competition/award entries
- Add student innovation entries
- Add teacher innovation entries
- Privacy display options
- Public achievements preview updates

---

## Phase 10 — Announcements and Events

Allow admin to manage notices.

Output:

- Add/edit/delete announcements
- Publish/unpublish
- Categories
- Public announcements preview updates

---

## Phase 11 — Downloads Management

Allow admin to upload public files.

Output:

- Upload admission forms
- Upload prospectus/book list/fees notices
- Publish/unpublish downloads
- Public downloads section updates

---

## Phase 12 — Public School Routes and Multi-School Support

Convert the app into a reusable multi-school platform.

Output:

- `/schools/[slug]`
- School-specific content loading
- Multiple schools in database
- Data separation by school

---

## Phase 13 — MiCilla Super Admin

Allow MiCilla to manage schools.

Output:

- Create school
- Create school admin
- Activate/deactivate schools
- Reset school admin password
- View all schools

---

## Phase 14 — Optional Schedule Module

Add timetable features after the publicity platform is strong.

Output:

- Classes
- Subjects/activities
- Class timetable
- Exam timetable
- Term calendar
- Daily routine for crèche/KG

---

## Phase 15 — Public Polish and Mobile Optimization

Polish for presentation and sales.

Output:

- Strong mobile layout
- Loading/empty states
- School not found page
- Better image handling
- Better footer
- Faster load where possible

---

## Phase 16 — Deployment

Deploy online.

Output:

- VPS setup
- PostgreSQL production database
- Nginx/Caddy
- HTTPS
- PM2/systemd
- Domain/subdomain setup
- Backups

---

## Phase 17 — Business Launch Materials

Prepare to sell.

Output:

- Sales flyer
- Pricing sheet
- Proposal template
- Onboarding form
- Support policy
- Renewal policy
- Demo script

---

# Current Immediate Focus

Only build:

1. Phase 0
2. Phase 1

Do not build:

- Database
- Admin login
- Admin dashboard
- Multi-school routing
- Timetable module
- Deployment

Those come later.

---

# Recommended Cursor Workflow

For every phase:

1. Paste `00-project-rules.md`
2. Paste this roadmap
3. Paste the current phase file
4. Tell Cursor to explain its plan before coding
5. Approve the plan
6. Let Cursor implement only the phase
7. Test locally
8. Commit
9. Move to next phase only after approval

---

# Standard Phase Start Prompt

```txt
Read 00-project-rules.md and 01-master-implementation-roadmap.md.
We are working only on the current phase file I will paste next.
Do not implement anything yet.
First explain your understanding of the current phase, what is allowed, what is not allowed, and where you will stop.
```

---

# Standard Phase Implementation Prompt

```txt
Proceed with implementation for this phase only.
Do not add future-phase features.
After implementation, list files changed, how to test, expected result, known limitations, and suggested git commit message.
```

---

# Standard Stop Rule

After each phase, Cursor must stop.

Cursor must not continue into the next phase unless instructed.
