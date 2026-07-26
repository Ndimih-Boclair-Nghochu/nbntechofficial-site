/**
 * Seed script.
 *
 *   npm run db:seed
 *
 * Creates:
 *  - the single AdminUser from ADMIN_EMAIL / ADMIN_PASSWORD_HASH
 *  - the SiteContent singleton (on-brand copy from lib/content-defaults)
 *  - a set of realistic placeholder Skills, Projects and Testimonials
 *
 * Idempotent: safe to run repeatedly (upserts by unique keys).
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import ws from "ws";
import { defaultSiteContent } from "../lib/content-defaults";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@nbntech.dev").toLowerCase();
  const name = process.env.ADMIN_NAME || "NBN TECH Admin";

  // Password precedence:
  //  1. ADMIN_PASSWORD_HASH — a pre-computed bcrypt hash (most secure; the
  //     plaintext never lives in env). Generate with: npm run hash -- "pw"
  //  2. ADMIN_PASSWORD — your plaintext password; hashed here at seed time so
  //     you can set email + password directly in env with no extra step.
  //  3. Fallback temporary password (local dev only).
  let passwordHash: string;
  if (process.env.ADMIN_PASSWORD_HASH) {
    passwordHash = process.env.ADMIN_PASSWORD_HASH;
  } else if (process.env.ADMIN_PASSWORD) {
    passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12);
    console.log("✔ Hashed ADMIN_PASSWORD from env.");
  } else {
    // Fallback for first-run local dev only — CHANGE THIS in production.
    passwordHash = bcrypt.hashSync("changeme-please", 12);
    console.warn(
      "⚠  Neither ADMIN_PASSWORD_HASH nor ADMIN_PASSWORD set — seeded a temporary password 'changeme-please'. Set one before deploying.",
    );
  }

  await prisma.adminUser.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });
  console.log(`✔ Admin user ready: ${email}`);
}

async function seedContent() {
  const { socialLinks, ...rest } = defaultSiteContent;
  await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: { ...rest, socialLinks },
    create: { ...rest, socialLinks },
  });
  console.log("✔ Site content seeded");
}

async function seedSkills() {
  const skills: Array<{
    name: string;
    category: "Frontend" | "Backend" | "Mobile" | "CloudDevOps" | "Other";
    proficiency: number;
    icon: string;
    order: number;
  }> = [
    { name: "TypeScript", category: "Frontend", proficiency: 95, icon: "Code2", order: 1 },
    { name: "React / Next.js", category: "Frontend", proficiency: 95, icon: "Atom", order: 2 },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 90, icon: "Palette", order: 3 },
    { name: "Node.js", category: "Backend", proficiency: 92, icon: "Server", order: 1 },
    { name: "Python / Django", category: "Backend", proficiency: 88, icon: "Terminal", order: 2 },
    { name: "PostgreSQL", category: "Backend", proficiency: 88, icon: "Database", order: 3 },
    { name: "Redis", category: "Backend", proficiency: 80, icon: "Zap", order: 4 },
    { name: "React Native", category: "Mobile", proficiency: 85, icon: "Smartphone", order: 1 },
    { name: "Electron", category: "Mobile", proficiency: 85, icon: "MonitorSmartphone", order: 2 },
    { name: "AWS", category: "CloudDevOps", proficiency: 88, icon: "Cloud", order: 1 },
    { name: "Docker", category: "CloudDevOps", proficiency: 86, icon: "Container", order: 2 },
    { name: "CI/CD (GitHub Actions)", category: "CloudDevOps", proficiency: 88, icon: "GitBranch", order: 3 },
    { name: "Linux / systemd", category: "CloudDevOps", proficiency: 84, icon: "TerminalSquare", order: 4 },
  ];

  // Clear + reinsert for a clean, deterministic demo set.
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({ data: skills });
  console.log(`✔ ${skills.length} skills seeded`);
}

async function seedProjects() {
  const projects = [
    {
      title: "EduIgnite — School Management Platform",
      slug: "eduignite-platform",
      summary:
        "A full school-management suite: web dashboard, mobile app and desktop build, with automated releases and cloud infrastructure.",
      description:
        "## The problem\n\nSchools were juggling attendance, grading, report cards and parent communication across spreadsheets and paper. EduIgnite consolidates all of it into one platform with role-based access for administrators, teachers and parents.\n\n## What I built\n\n- A **Next.js + Django** web platform with a typed REST API.\n- **Mobile and desktop apps** (React Native / Electron) sharing the same backend, each with CI-driven auto-releases.\n- **AWS infrastructure**: EC2 + systemd services (gunicorn, Celery worker/beat) and Redis for background jobs.\n- Cross-account consistency so parents always render the official report card, never a local rebuild.\n\n## Outcome\n\nThree coordinated apps shipping continuously, with a release pipeline that turns a commit into a versioned installer without manual steps.",
      role: "Sole engineer — architecture, backend, apps and infrastructure",
      techStack: ["Next.js", "Django", "React Native", "Electron", "PostgreSQL", "Redis", "AWS", "Celery"],
      coverImageUrl: null,
      coverImageAlt: "EduIgnite platform dashboard",
      gallery: [],
      liveUrl: "",
      githubUrl: "",
      featured: true,
      order: 1,
      category: "Web" as const,
    },
    {
      title: "JuniorIgnite — Offline Learning App",
      slug: "juniorignite",
      summary:
        "A primary-school desktop learning app with fully offline Ed25519 licensing and a one-repo deploy for site, API and installer.",
      description:
        "## The problem\n\nPrimary schools with unreliable connectivity still needed licensed, updatable learning software that works entirely offline.\n\n## What I built\n\n- An **Electron** desktop app for primary-school learning.\n- **Offline Ed25519 licensing** — signed licences verified on-device with no server round-trip.\n- A single public repo containing the marketing site, API server and desktop build, with a documented deploy path to a live EC2 instance.\n\n## Outcome\n\nA self-contained product that installs, licenses and updates without depending on a live connection.",
      role: "Sole engineer",
      techStack: ["Electron", "Node.js", "Ed25519", "EC2", "TypeScript"],
      coverImageUrl: null,
      coverImageAlt: "JuniorIgnite learning app",
      gallery: [],
      liveUrl: "",
      githubUrl: "",
      featured: true,
      order: 2,
      category: "Mobile" as const,
    },
    {
      title: "Serverless API on AWS",
      slug: "serverless-api-aws",
      summary:
        "A cost-aware, autoscaling REST API built on serverless primitives with infrastructure as code and full observability.",
      description:
        "## Overview\n\nA production REST API designed to scale to zero and bill only for real usage, provisioned entirely through infrastructure as code.\n\n## Highlights\n\n- Serverless compute with a managed Postgres backend.\n- IaC-defined environments so staging and production never drift.\n- Structured logging, tracing and alerting wired in from day one.\n\n## Outcome\n\nLow idle cost, predictable scaling, and a repeatable deploy that any teammate can run.",
      role: "Backend & platform engineer",
      techStack: ["AWS", "Serverless", "PostgreSQL", "Terraform", "Node.js"],
      coverImageUrl: null,
      coverImageAlt: "Cloud architecture diagram",
      gallery: [],
      liveUrl: "",
      githubUrl: "",
      featured: true,
      order: 3,
      category: "CloudDevOps" as const,
    },
    {
      title: "Realtime Analytics Dashboard",
      slug: "realtime-analytics-dashboard",
      summary:
        "A responsive analytics dashboard with live-updating charts, server components and edge-cached data.",
      description:
        "## Overview\n\nAn analytics surface that stays fast under load by combining React Server Components with edge caching and incremental updates.\n\n## Highlights\n\n- Streamed, server-rendered charts with no client waterfall.\n- Accessible, keyboard-navigable data tables.\n- Sub-second interactions even on large datasets.\n\n## Outcome\n\nA dashboard that feels instant and reads clearly on any device.",
      role: "Full-stack engineer",
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
      coverImageUrl: null,
      coverImageAlt: "Analytics dashboard interface",
      gallery: [],
      liveUrl: "",
      githubUrl: "",
      featured: false,
      order: 4,
      category: "Web" as const,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✔ ${projects.length} projects seeded`);
}

async function seedTestimonials() {
  const items = [
    {
      name: "A. Mensah",
      role: "Founder, EdTech startup",
      quote:
        "NBN TECH shipped what two previous teams couldn't. Careful, communicative, and the code still runs clean a year later.",
      avatarUrl: null,
      order: 1,
    },
    {
      name: "R. Okoro",
      role: "Product Lead",
      quote:
        "The rare engineer who thinks about the second release, not just the demo. Our launch was genuinely uneventful — exactly as promised.",
      avatarUrl: null,
      order: 2,
    },
  ];
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({ data: items });
  console.log(`✔ ${items.length} testimonials seeded`);
}

async function main() {
  console.log("Seeding NBN TECH database…\n");
  await seedAdmin();
  await seedContent();
  await seedSkills();
  await seedProjects();
  await seedTestimonials();
  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
