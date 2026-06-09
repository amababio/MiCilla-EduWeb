# 19 — MiCilla EduWeb Testing Checklist

## Purpose

This file contains general testing steps for MiCilla EduWeb.

Use it after each phase.

---

# Basic Local App Checks

Run:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Check:

- App loads
- No blank screen
- No major console errors
- Page is usable
- Styling loads correctly

---

# Lint Check

Run:

```bash
npm run lint
```

Expected:

- No lint errors
- Warnings should be reviewed

If lint fails, fix only the lint issue. Do not refactor unrelated code.

---

# Build Check

Run:

```bash
npm run build
```

Expected:

- Build completes successfully

If build fails:

- Read the exact error
- Fix the smallest related issue
- Do not rewrite unrelated files

---

# Mobile Layout Check

Use browser dev tools or resize the browser.

Check widths:

- 375px mobile
- 414px mobile
- 768px tablet
- Desktop width

Check:

- Header does not overflow
- Buttons are clickable
- Text is readable
- Cards stack nicely
- Images/placeholders do not break layout
- WhatsApp/contact button remains visible

---

# Public Demo Website Checks

For Phase 1, verify:

- Header exists
- Hero section exists
- Admissions section exists
- About section exists
- Programs section exists
- Why Choose Us section exists
- Gallery preview exists
- Excellence & Achievements preview exists
- Announcements preview exists
- Downloads preview exists
- Contact section exists
- Footer exists
- Powered by MiCilla Technologies appears
- Page is polished enough for demo

---

# Future Database Checks

Use when Phase 2 starts.

Run:

```bash
npx prisma validate
```

Expected:

- Prisma schema validates

Run:

```bash
npx prisma migrate dev
```

Expected:

- Migration succeeds

Run:

```bash
npx prisma studio
```

Expected:

- Database opens in Prisma Studio
- Demo school data exists

---

# Future Admin Auth Checks

Use when Phase 3 starts.

Check:

- Admin login page loads
- Wrong password fails
- Correct password logs in
- Dashboard is protected
- Logout works
- Visiting dashboard while logged out redirects to login

---

# Future Dashboard Checks

Use when dashboard phases start.

Check:

- Sidebar links work
- Forms save correctly
- Public site updates after changes
- Admin sees only their school
- Simple labels are used
- No technical database words are shown to school admins

---

# Future Multi-School Checks

Use when Phase 12 starts.

Create two demo schools.

Check:

- Each school has a unique slug
- `/schools/school-one` loads school one data
- `/schools/school-two` loads school two data
- School one admin cannot manage school two data
- Announcements do not mix
- Gallery images do not mix
- Downloads do not mix
- Achievements do not mix

---

# Future Upload Checks

Use when upload phases start.

Check:

- File upload works
- Wrong file type is rejected if validation exists
- Large files are handled reasonably
- Uploaded file displays publicly where expected
- Deleted files no longer appear
- Missing files do not crash the site

---

# Future Excellence & Achievements Checks

Use when Phase 9 starts.

Check:

- Admin can add academic performance entry
- Admin can add BECE result entry
- Admin can add competition entry
- Admin can add student innovation entry
- Admin can add teacher innovation entry
- Featured achievements show on homepage
- Unpublished achievements do not show publicly
- Privacy display mode works
- Student full name is not shown unless selected

---

# Future Deployment Checks

Use when deployment phase starts.

Check:

- Production environment variables are set
- Database connection works
- App starts with PM2/systemd
- Nginx/Caddy routes traffic correctly
- HTTPS works
- Domain loads app
- Upload paths work
- Backups are configured
- Admin login works online

---

# Rule for Fixes

When an error appears:

1. Copy the exact error.
2. Ask Cursor to explain the cause.
3. Ask Cursor to fix only the smallest related issue.
4. Re-run the failed command.
5. Do not allow broad refactors unless absolutely necessary.
