# NBN TECH — Personal Brand & Portfolio

A bespoke, production-ready portfolio and personal-brand site for **NBN TECH**, a
software engineer working across web, mobile, cloud, and DevOps.

Editorial design, a database-backed admin panel, image uploads, and single-admin
authentication — built to be deployed on **Vercel Hobby** with **Neon** Postgres
and **Vercel Blob**, all from one dashboard.

---

## Tech stack

| Concern        | Choice                                                            |
| -------------- | ---------------------------------------------------------------- |
| Framework      | Next.js 14 (App Router) + TypeScript                             |
| Styling        | Tailwind CSS (custom design tokens)                              |
| Animation      | Framer Motion (scroll reveals + hero parallax)                   |
| Database       | Neon serverless Postgres via Prisma (`@prisma/adapter-neon`)     |
| Auth           | Auth.js (NextAuth v5), Credentials provider, single admin        |
| Image uploads  | Vercel Blob                                                      |
| Validation     | Zod (shared between client forms and API routes)                 |
| Passwords      | bcryptjs (hashed, never stored in plaintext)                     |

---

## Features

**Public site** (all content pulled live from the database, with graceful
fallbacks so it never renders empty):

- **Home** — full-bleed hero with animated tech-grid + parallax, about preview,
  four expertise pillars, featured projects, tech-stack grid, testimonials, CTA.
- **About** — narrative bio, values, process teaser.
- **Work** — filterable project grid (Web / Mobile / Cloud & DevOps).
- **Work detail** — Markdown case study, meta sidebar, gallery, prev/next nav.
- **Process** — visual step-by-step engagement timeline.
- **Contact** — validated form (with honeypot + optional email delivery) and
  social links.
- SEO metadata + Open Graph on every page, dynamic OG image, `sitemap.xml`,
  `robots.txt`, accessible semantic HTML, keyboard nav, reduced-motion support.

**Admin panel** (`/admin`, protected server-side via middleware **and** layout):

- Dashboard with live counts.
- Projects CRUD (cover + gallery uploads, tech-stack chips, featured toggle).
- Skills CRUD (category, proficiency meter, ordering).
- Site content editor (hero / about / contact / social / SEO) — no redeploy.
- Testimonials CRUD.

There is **no public signup** — exactly one admin account, created by the seed
script.

---

## Project structure

```
app/
  (site)/            Public pages (Navbar + Footer layout)
    page.tsx         Home
    about/ work/ process/ contact/
  admin/
    login/           Standalone login (no sidebar)
    (panel)/         Protected admin (sidebar layout)
  api/               Route handlers (skills, projects, content,
                     testimonials, upload, contact, auth)
  layout.tsx         Root layout, fonts, base metadata
  opengraph-image.tsx, sitemap.ts, robots.ts, not-found.tsx
components/
  site/              Public UI (Hero, Pillars, ProjectCard, …)
  admin/             Admin UI (managers, forms, uploaders)
  ui/                Primitives (Button, Container)
  Logo.tsx
lib/
  prisma.ts          Prisma + Neon adapter
  data.ts            Resilient read layer (fallbacks)
  validations.ts     Zod schemas (shared)
  blob.ts, api.ts, utils.ts, content-defaults.ts
prisma/
  schema.prisma, seed.ts
scripts/
  hash-password.ts
auth.ts, auth.config.ts, middleware.ts
```

---

## Local setup

### 1. Install

```bash
npm install
```

> Node 18.18+ (Node 20/22/24 fine). This project pins `node-gyp` via `overrides`
> to avoid native-build issues on Windows.

### 2. Environment variables

Copy the example and fill it in:

```bash
cp .env.example .env
```

| Variable                | What it is                                                        |
| ----------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`          | Neon **pooled** connection string (host has `-pooler`)           |
| `DIRECT_URL`            | Neon **direct** string for migrations (optional)                 |
| `AUTH_SECRET`           | Random secret — `openssl rand -base64 32`                        |
| `ADMIN_EMAIL`           | The single admin's email (yours — set it to anything)            |
| `ADMIN_NAME`            | Display name                                                     |
| `ADMIN_PASSWORD`        | Your admin password in plaintext (hashed for you at seed time)   |
| `ADMIN_PASSWORD_HASH`   | *(alternative)* a pre-computed bcrypt hash — see below           |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (for image uploads)                            |
| `NEXT_PUBLIC_SITE_URL`  | Production URL, e.g. `https://nbntech.dev`                       |

### Setting your admin email & password

You own these values — set them yourself in env vars. Pick **one** password option:

- **Simplest —** set `ADMIN_EMAIL` and `ADMIN_PASSWORD` (plaintext). The seed
  script bcrypt-hashes the password before storing it; you log in with that
  password. Nothing else to do.
- **Most secure —** leave `ADMIN_PASSWORD` blank and instead pre-compute a hash
  so the plaintext never lives in env:

  ```bash
  npm run hash -- "your-strong-password"
  # → prints ADMIN_PASSWORD_HASH="$2a$12$…"  — paste that into ADMIN_PASSWORD_HASH
  ```

If both are set, `ADMIN_PASSWORD_HASH` takes precedence. After changing either,
re-run `npm run db:seed` to update the stored admin.

### 3. Database — migrate & seed

With `DATABASE_URL` set to a real Neon database:

```bash
npm run db:migrate      # create tables (prisma migrate dev)
npm run db:seed         # admin user + on-brand placeholder content
```

> No database yet? The site still runs — every page falls back to on-brand
> default content, and the admin dashboard shows a "database not reachable"
> notice. Add `DATABASE_URL` and re-run the two commands above to go live.

### 4. Run

```bash
npm run dev             # http://localhost:3000
```

Admin: <http://localhost:3000/admin/login> (use `ADMIN_EMAIL` + your password).

---

## The logo

Drop the supplied artwork at **`public/logo.png`**. It is used in the navbar,
footer, admin, and login. A matching `public/favicon.svg` is included; to use a
raster favicon, add `app/icon.png` (Next.js picks it up automatically). The OG
share image is generated on the fly in `app/opengraph-image.tsx`.

---

## Deploy to Vercel (Hobby / free)

### 1. Push to GitHub

```bash
git add -A
git commit -m "NBN TECH portfolio"
git push
```

### 2. Import into Vercel

- <https://vercel.com/new> → import this repository. Framework auto-detects as
  **Next.js**. Don't deploy yet — set up storage first.

### 3. Add Neon Postgres (Vercel Marketplace)

- Project → **Storage** → **Create Database** → **Neon** (Postgres).
- Follow the flow; Vercel injects `DATABASE_URL` (and related vars)
  automatically. Use the **pooled** URL (host contains `-pooler`) — the app is
  built for the serverless driver.

### 4. Add Vercel Blob

- Project → **Storage** → **Create** → **Blob**.
- This adds `BLOB_READ_WRITE_TOKEN` to the project automatically.

### 5. Add the remaining env vars

In **Settings → Environment Variables**, add:

- `AUTH_SECRET` — `openssl rand -base64 32`
- `ADMIN_EMAIL`, `ADMIN_NAME`
- `ADMIN_PASSWORD_HASH` — from `npm run hash -- "…"`
- `NEXT_PUBLIC_SITE_URL` — your production domain

### 6. Deploy, then migrate & seed

- Click **Deploy**. The build runs `prisma generate && next build`.
- Apply the schema and seed the admin, pointing at the production database.
  Pull the prod env locally and run once:

  ```bash
  vercel env pull .env.production.local
  npx dotenv -e .env.production.local -- npm run db:deploy   # prisma migrate deploy
  npx dotenv -e .env.production.local -- npm run db:seed
  ```

  (Or run `prisma migrate deploy` + the seed from any machine with the prod
  `DATABASE_URL`.)

### 7. Done

Visit your domain, then sign in at `/admin/login` to replace the placeholder
copy, add real projects, and upload images.

---

## Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Dev server                               |
| `npm run build`     | `prisma generate` + production build     |
| `npm run start`     | Serve the production build               |
| `npm run lint`      | ESLint                                   |
| `npm run db:migrate`| Create/apply migrations (dev)            |
| `npm run db:deploy` | Apply migrations (production)            |
| `npm run db:seed`   | Seed admin + placeholder content         |
| `npm run db:studio` | Prisma Studio (browse the database)      |
| `npm run hash -- "pw"` | Generate a bcrypt password hash       |

---

## Notes on security

- Admin routes are protected in **two** places: edge `middleware.ts` and the
  `/admin/(panel)` server layout. API routes independently re-check the session.
- Passwords are bcrypt-hashed; the plaintext is never stored or logged.
- All forms validate with Zod on both the client and the server.
- `robots.txt` disallows `/admin` and `/api`; admin pages are `noindex`.

---

## Optional: contact email delivery

The contact form works out of the box (messages are validated and logged
server-side). To receive them by email, set `RESEND_API_KEY` (and optionally
`CONTACT_FROM`) — the API route will send via [Resend](https://resend.com).
Without it, the visible email + `mailto:` remain the fallback.
```
