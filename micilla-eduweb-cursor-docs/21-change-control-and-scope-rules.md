# 21 — Change Control and Scope Rules

## Purpose

This file prevents MiCilla EduWeb from becoming too large too early.

The project must stay focused on a sellable MVP.

---

# Core Product

MiCilla EduWeb is a reusable school website platform for private basic schools in Ghana.

The core value is:

- Publicity
- Admissions support
- Trust and credibility
- School branding
- Gallery and photos
- Excellence & Achievements
- Announcements
- Downloads
- Contact/WhatsApp
- Simple admin dashboard
- Multi-school support

---

# MVP Features Allowed

The MVP may include:

- Public school homepage
- Admissions section
- About section
- Programs/levels
- Why Choose Us
- Gallery
- Excellence & Achievements
- Announcements
- Downloads
- Contact/WhatsApp
- Admin login
- Admin dashboard
- School profile management
- Homepage content management
- Gallery management
- Achievement management
- Announcement management
- Download management
- Multi-school support
- MiCilla super admin

---

# Optional After Core MVP

These may be added after the core publicity platform is strong:

- Class timetable
- Exam timetable
- Term calendar
- Daily routine for crèche/KG
- Teacher timetable
- CSV import
- PDF export
- Better file storage
- Custom domains
- Subdomains

---

# Not Allowed in MVP

Do not build these in the MVP:

- Parent portal
- Student portal
- Staff portal
- Fees payment
- Online admissions with full workflow
- Attendance tracking
- Report cards
- Student result management
- Full school management system
- SMS automation
- WhatsApp automation
- Mobile app
- Online exams
- Payroll
- Accounting
- Inventory
- Transport management
- Library management
- Hostel management
- Learning management system

These are future modules only.

---

# Feature Request Handling

When a new feature idea appears, classify it as one of these:

## Category A — Core MVP

It supports publicity, admissions, branding, trust, gallery, achievements, announcements, downloads, contact, or simple admin management.

It can be considered for MVP.

## Category B — Optional Add-On

It is useful but not required for the first sellable version.

It should be documented for later.

## Category C — Future Platform Module

It turns the product into a larger school management system.

It must not be built now.

---

# Example Classifications

## Excellence & Achievements

Category A — Core MVP or Standard package feature.

Reason:

It supports school publicity, trust, parent confidence, and admissions.

Allowed.

---

## Timetable

Category B — Optional Add-On.

Reason:

Useful, but not the main selling point for Ghanaian private schools.

Build after the publicity platform is strong.

---

## Parent Portal

Category C — Future Platform Module.

Reason:

Adds authentication, student relationships, private data, and ongoing school management complexity.

Not allowed in MVP.

---

## Fees Payment

Category C — Future Platform Module.

Reason:

Requires payment integrations, reconciliation, financial records, and stronger security.

Not allowed in MVP.

---

## Online Admission Form

Category B or C depending on complexity.

Simple downloadable admission form: allowed.

Full online application workflow: future module.

---

# Rule for Adding New Features

Before adding any new feature, answer:

1. Does it support the publicity-first school website goal?
2. Is it needed for the first sellable version?
3. Can it be built without delaying the MVP?
4. Does it introduce private student/parent data?
5. Does it require complex permissions?
6. Does it require payment, SMS, or external integrations?

If the feature increases complexity too much, document it for later.

Do not build it immediately.

---

# Cursor Scope Control Instruction

Use this when Cursor starts drifting:

```txt
This is outside the current MVP scope.

Document it as a future feature only.

Return to the current phase and implement only the approved scope.
```

---

# Approval Rule

No new module should be added unless Michael approves it.

No future module should be implemented because Cursor thinks it is useful.

---

# Current Approved MVP Direction

Build in this priority order:

1. Public demo website
2. Database
3. Admin login
4. Admin dashboard
5. School profile and branding management
6. Homepage content management
7. Programs
8. Gallery
9. Excellence & Achievements
10. Announcements
11. Downloads
12. Multi-school support
13. MiCilla super admin
14. Polish
15. Deployment

Optional schedule module can come after the main publicity platform is solid.
