# 03 — Phase 1: Public Demo School Website

## Goal

Build a beautiful public demo school website using hardcoded sample content.

This demo will be used to judge the look and marketability of MiCilla EduWeb before building database and admin features.

Do not build database, admin login, or dashboard in this phase.

---

# Demo School Identity

Use this sample school:

```txt
School Name: Bright Future Academy
Tagline: Quality education from Crèche to JHS
Motto: Discipline, Excellence, and Character
Location: Abuakwa, Ashanti Region
Phone: 024 000 0000
WhatsApp: 024 000 0000
Email: info@brightfuture.edu.gh
```

Use realistic Ghanaian private school language.

---

# Public Homepage Sections

Build the homepage with these sections in order:

1. Header
2. Hero section
3. Admissions section
4. About section
5. Programs / Levels section
6. Why Choose Us section
7. Gallery preview
8. Excellence & Achievements preview
9. Announcements preview
10. Downloads preview
11. Contact / WhatsApp section
12. Footer

---

# 1. Header

The header should include:

- School name
- Simple logo placeholder or initials
- Navigation links
- Call button
- WhatsApp button

Suggested navigation:

- Home
- Admissions
- Programs
- Gallery
- Achievements
- Contact

The header should work well on mobile.

If a mobile menu is too much for this phase, a clean responsive stacked layout is acceptable.

---

# 2. Hero Section

The hero section should make the school look professional.

Include:

- School name
- Tagline
- Short sentence
- Admissions CTA
- WhatsApp CTA
- School image/banner placeholder

Suggested copy:

```txt
Bright Future Academy
Quality education from Crèche to JHS

A safe, disciplined, and child-friendly school environment focused on academic excellence, moral training, and strong foundational learning.
```

Buttons:

- Apply for Admission
- Chat on WhatsApp

Use a visual card or placeholder that suggests a school photo.

No real images are required yet. Use gradients, placeholders, or local sample placeholders.

---

# 3. Admissions Section

Show that admissions are open.

Suggested copy:

```txt
Admissions Open for 2026/2027 Academic Year

We are currently accepting learners into Crèche, Nursery, KG, Primary, and JHS. Contact our admissions office for enquiries, school visit arrangements, and admission requirements.
```

Include:

- Available levels
- Download admission form button
- Call/WhatsApp button

The download button can be non-functional in this phase.

---

# 4. About Section

Suggested copy:

```txt
Bright Future Academy provides a caring and disciplined learning environment where children are supported to grow academically, socially, and morally. Our school combines strong classroom teaching with practical activities, creativity, and character development.
```

Include 3 small value cards:

- Academic Excellence
- Discipline & Moral Training
- Safe Child-Friendly Environment

---

# 5. Programs / Levels Section

Display cards for:

- Crèche
- Nursery
- Kindergarten
- Primary
- JHS

Suggested descriptions:

## Crèche

A caring environment for early social, emotional, and language development.

## Nursery

Play-based learning with phonics, numeracy, storytelling, music, and creative activities.

## Kindergarten

Strong preparation for primary school through literacy, numeracy, confidence, and social development.

## Primary

A solid foundation in English, Mathematics, Science, ICT, Creative Arts, and character formation.

## JHS

Focused academic preparation, discipline, BECE readiness, and personal development.

---

# 6. Why Choose Us Section

Include 5 to 6 points:

- Qualified and caring teachers
- Safe learning environment
- Strong academic foundation
- Discipline and moral training
- Active parent communication
- Child-friendly classrooms

Use clean cards or icons.

---

# 7. Gallery Preview

Show a section titled:

```txt
School Life in Pictures
```

Use 4 to 6 placeholder cards.

Suggested categories:

- Classroom Learning
- Cultural Day
- Sports Day
- Graduation
- ICT Lessons
- Reading Time

Use placeholders if no images are available.

Do not build upload functionality in this phase.

---

# 8. Excellence & Achievements Preview

This is important for publicity.

Section title:

```txt
Excellence & Achievements
```

Subtitle:

```txt
Celebrating academic performance, competitions, student creativity, and teacher innovation.
```

Show 3 cards:

## Academic Performance

```txt
Strong preparation for internal assessments, mock examinations, and BECE success.
```

## Competitions & Awards

```txt
Our learners are encouraged to participate in quizzes, debates, sports, cultural activities, and academic competitions.
```

## Innovation Showcase

```txt
We celebrate student projects, creative work, practical learning activities, and teacher-led classroom innovations.
```

Add a note that full achievements will be managed later from the dashboard.

Do not build database or admin features in this phase.

---

# 9. Announcements Preview

Show 3 sample announcements:

1. Admissions open for 2026/2027 academic year
2. PTA meeting scheduled for Friday
3. End-of-term assessment timetable coming soon

Each announcement should show:

- Title
- Category
- Short message
- Date placeholder

---

# 10. Downloads Preview

Show sample download cards:

- Admission Form
- School Prospectus
- Book List
- Term Calendar

Buttons can be non-functional in this phase.

Clearly keep them as demo placeholders.

---

# 11. Contact / WhatsApp Section

Include:

- Phone
- WhatsApp
- Email
- Location
- Office hours
- Nearby landmark placeholder
- Google Maps button placeholder

Make WhatsApp CTA very visible.

Suggested copy:

```txt
Have questions about admissions? Contact the school office or chat with us on WhatsApp.
```

---

# 12. Footer

Footer should include:

- School name
- Motto
- Quick links
- Contact
- Powered by MiCilla Technologies

Use:

```txt
Powered by MiCilla Technologies
```

---

# Design Requirements

The design should be:

- Mobile-friendly
- Clean
- Professional
- Warm
- Suitable for Ghanaian private schools
- Easy to understand
- Visually attractive enough for a demo
- Not too technical-looking

Suggested visual style:

- Light background
- Strong hero section
- Rounded cards
- Clear buttons
- Good spacing
- Friendly school colors
- Professional typography

---

# Technical Requirements

Allowed:

- Hardcoded content
- Component-based sections
- Tailwind CSS
- Local arrays for sample data
- Simple reusable section components

Not allowed:

- Database
- Prisma
- Admin dashboard
- Authentication
- Uploads
- Real file downloads
- Multi-school routing
- Timetable system
- Payment system

---

# Suggested Component Structure

Create components like:

```txt
src/components/public-site/Header.tsx
src/components/public-site/HeroSection.tsx
src/components/public-site/AdmissionsSection.tsx
src/components/public-site/AboutSection.tsx
src/components/public-site/ProgramsSection.tsx
src/components/public-site/WhyChooseUsSection.tsx
src/components/public-site/GalleryPreview.tsx
src/components/public-site/AchievementsPreview.tsx
src/components/public-site/AnnouncementsPreview.tsx
src/components/public-site/DownloadsPreview.tsx
src/components/public-site/ContactSection.tsx
src/components/public-site/Footer.tsx
```

Create sample data in:

```txt
src/data/demoSchool.ts
```

Do not over-engineer.

---

# Testing Steps

Run:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Check:

- Homepage loads
- All sections appear in correct order
- Buttons appear
- WhatsApp/contact section is visible
- Page looks good on mobile width
- No console errors

Run:

```bash
npm run lint
```

Expected:

- No lint errors

Run if available:

```bash
npm run build
```

Expected:

- Build succeeds

---

# Acceptance Criteria

Phase 1 is complete when:

- A polished demo school homepage exists.
- It uses the Bright Future Academy demo content.
- It includes all required sections.
- Excellence & Achievements preview is included.
- The page is responsive.
- The page looks professional enough to show a school owner.
- No database/admin/future features are added.
- Lint passes.
- Build passes if tested.

---

# Stop Point

Stop after the public demo website is complete.

Do not begin database work.

Do not add admin login.

Do not add dashboard.

Do not add multi-school routing.

---

# Suggested Git Commit Message

```txt
feat: build public demo school homepage
```

---

# Cursor Completion Response Format

At the end, report:

```txt
Phase 1 complete.

Files created/changed:
- ...

How to test:
- ...

Expected result:
- ...

Known limitations:
- Content is hardcoded demo data.
- Downloads are placeholders.
- No admin dashboard yet.
- No database yet.

Suggested commit:
feat: build public demo school homepage
```
