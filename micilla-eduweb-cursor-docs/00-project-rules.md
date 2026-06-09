# 00 — MiCilla EduWeb Project Rules for Cursor

## Purpose

This file controls how Cursor should behave while building **MiCilla EduWeb**.

MiCilla EduWeb is a reusable school website platform for private basic schools in Ghana. The platform is focused on publicity, admissions, school branding, gallery, Excellence & Achievements, announcements, downloads, contact/WhatsApp, and optional timetable features.

Cursor must follow these rules throughout the project.

---

# 1. Product Direction

Cursor must understand that this is **not mainly a timetable website**.

The main purpose of the platform is to help private schools:

- Look professional online
- Attract parents
- Promote admissions
- Display school photos
- Share announcements
- Display achievements
- Showcase student and teacher innovation
- Provide downloads
- Make contact easy through phone and WhatsApp
- Manage website content without technical skills

Timetables and schedules are optional supporting features, not the main product.

---

# 2. Development Style

Cursor must build the project in phases.

Cursor must not jump ahead.

Cursor must not build features from future phases unless explicitly asked.

Cursor must not redesign the project direction.

Cursor must not introduce advanced modules that are outside the MVP.

Cursor must keep the code readable and beginner-friendly.

Cursor must explain major changes after implementation.

Cursor must provide testing steps after every checkpoint.

---

# 3. MVP Scope

The first MVP focuses on:

- Public demo school website
- Beautiful mobile-friendly homepage
- Admissions section
- About section
- Programs/levels section
- Why Choose Us section
- Gallery preview
- Excellence & Achievements preview
- Announcements preview
- Downloads preview
- Contact and WhatsApp section
- Footer
- Later: database, admin login, dashboard, and multi-school support

The first MVP does not include:

- Parent portal
- Student portal
- Staff portal
- Fees payment
- Attendance system
- Report cards
- Full school management system
- SMS automation
- WhatsApp automation
- Mobile app
- Online exams
- Payroll
- Accounting
- Inventory

---

# 4. Cursor Must Ask Before These Actions

Cursor must ask before:

- Deleting large parts of code
- Replacing the chosen stack
- Changing the project structure significantly
- Installing major libraries not required for the current phase
- Adding future modules
- Rewriting completed working pages
- Changing database schema after migrations exist
- Changing authentication approach
- Adding deployment configuration before deployment phase

---

# 5. Cursor Must Not Do These Things

Cursor must not:

- Add features not requested in the current phase
- Build the entire platform at once
- Convert the project into a school management system
- Add complex role systems in early phases
- Add payment features
- Add parent/student portals
- Add SMS/WhatsApp automation
- Add unnecessary packages
- Use overly complex architecture
- Hide important logic without comments
- Skip testing instructions
- Continue into the next phase without approval

---

# 6. Code Quality Rules

Cursor should:

- Use TypeScript where possible
- Use clear file names
- Use reusable components
- Keep components simple
- Avoid over-engineering
- Add comments where logic may confuse a beginner
- Keep UI mobile-friendly
- Avoid duplicated layout code where reasonable
- Use meaningful variable names
- Keep forms simple
- Keep validation clear
- Avoid unnecessary abstractions

---

# 7. UI/UX Rules

The website should feel:

- Professional
- Trustworthy
- Clean
- School-friendly
- Parent-friendly
- Mobile-first
- Ghanaian private-school appropriate

The design should support:

- School photos
- Admissions call-to-action
- WhatsApp contact
- Clear school branding
- Clean program cards
- Strong gallery section
- Excellence and achievements showcase
- Easy navigation

Avoid a design that feels too technical, too empty, or too corporate.

---

# 8. Admin Dashboard Language Rules

When admin dashboard phases begin, use simple school-friendly language.

Avoid technical words like:

- Database
- Schema
- Entity
- Record
- Slug
- Foreign key
- API

Use simple words like:

- School Profile
- School Link
- Photos
- Notices
- Files
- Save Changes
- Preview Website
- Programs
- Achievements
- Contact Details

---

# 9. Multi-School Rule

The platform must eventually support many schools.

When database phases begin, every school-owned item must belong to a school using `schoolId`.

Examples:

- Programs belong to a school
- Gallery images belong to a school
- Achievements belong to a school
- Announcements belong to a school
- Downloads belong to a school
- Website settings belong to a school

Cursor must not build single-school-only backend logic once the database phase begins.

---

# 10. Excellence & Achievements Rule

The Excellence & Achievements module is allowed because it supports publicity and parent trust.

It should support:

- BECE performance
- Mock exam performance
- Competitions
- Awards
- Student innovation
- Teacher innovation
- Science projects
- ICT projects
- Sports
- Cultural achievements
- Creative arts
- School projects

Student privacy must be respected.

The system should eventually support:

- Show full name
- Show first name only
- Show class only
- Hide student name

Default safe display should avoid exposing full student details unless approved by the school.

---

# 11. Phase Completion Rule

At the end of every phase, Cursor must provide:

- Files created/changed
- What was implemented
- How to test it
- Expected result
- Known limitations
- Suggested git commit message
- Clear stop point

Cursor must stop after completing the current phase.

---

# 12. Standard Instruction to Cursor

Use this at the start of each Cursor session:

```txt
Read 00-project-rules.md first and follow it strictly.
Do not implement anything yet.
Confirm your understanding of the project direction, current phase, allowed scope, and stop point.
```

---

# 13. Current Build Priority

The immediate build priority is:

1. Phase 0 — Project setup
2. Phase 1 — Public demo school website

Do not start database, admin dashboard, authentication, or deployment until those phases are approved.
