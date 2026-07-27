import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonOk } from "@/lib/api";

/** TEMPORARY diagnostic + one-time project seeder — token-guarded. REMOVE after. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = "nbn-diag-8462";

const PROJECTS = [
  { slug: "eduignite-web", title: "EduIgnite — Web Platform", category: "Web" as const, featured: true, order: 1,
    summary: "A complete browser-based school-management platform for Cameroon schools — admissions, attendance, marks, bilingual report cards, fees and family messaging.",
    description: "EduIgnite runs an entire school from one place, in any browser — no install needed.\n\n- Admissions, attendance, marks and QR-verified bilingual report cards\n- Fee receipts, timetables and parent messaging\n- Role-based access for students, teachers, parents and staff",
    role: "Sole engineer — architecture, backend & frontend", techStack: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
    coverImageUrl: "/projects/eduignite-web.png", coverImageAlt: "EduIgnite web platform", liveUrl: "https://www.eduignite.online/" },
  { slug: "eduignite-mobile", title: "EduIgnite — Mobile App", category: "Mobile" as const, featured: true, order: 2,
    summary: "The EduIgnite Android app — parents follow their child, teachers mark and message, students track results, with full offline support.",
    description: "The full school in a pocket. The Android app keeps working offline and syncs when back online.\n\n- Parents follow attendance, results and messages\n- Teachers record marks and message families\n- Students see assignments and grades",
    role: "Sole engineer", techStack: ["React Native", "Offline sync"],
    coverImageUrl: "/projects/eduignite-mobile.png", coverImageAlt: "EduIgnite Android app", liveUrl: "https://www.eduignite.online/download" },
  { slug: "eduignite-desktop", title: "EduIgnite — Desktop App", category: "Desktop" as const, featured: false, order: 3,
    summary: "The EduIgnite Windows app — the administrator's command centre for running the whole school and printing QR-verified report cards and ID cards, online or off.",
    description: "The administrator's command centre — a Windows desktop app for the whole school office.\n\n- Manage the entire school from one place\n- Print official report cards and QR-verified ID cards\n- Keeps working when the internet drops",
    role: "Sole engineer", techStack: ["Electron", "Node.js"],
    coverImageUrl: "/projects/eduignite-desktop.png", coverImageAlt: "EduIgnite Windows desktop app", liveUrl: "https://www.eduignite.online/download" },
  { slug: "juniorignite-web", title: "JuniorIgnite — Website", category: "Web" as const, featured: true, order: 4,
    summary: "The website for JuniorIgnite — offline-first school management built specifically for nursery and primary schools in Cameroon.",
    description: "Marketing and onboarding site for JuniorIgnite, an offline-first school-management product for nursery and primary schools.\n\n- Presents the product and its offline approach\n- Guides setup and distributes the desktop app",
    role: "Sole engineer", techStack: ["Next.js", "Node.js"],
    coverImageUrl: "/projects/juniorignite-web.png", coverImageAlt: "JuniorIgnite website", liveUrl: "http://18.209.220.209/home" },
  { slug: "juniorignite-desktop", title: "JuniorIgnite — Desktop App", category: "Desktop" as const, featured: false, order: 5,
    summary: "The JuniorIgnite Windows app — fully offline school management for nursery & primary schools, secured with signed on-device licensing.",
    description: "A fully offline Windows desktop application for nursery and primary schools.\n\n- Runs with no internet connection\n- Protected by signed on-device licensing",
    role: "Sole engineer", techStack: ["Electron", "Ed25519", "Node.js"],
    coverImageUrl: "/projects/juniorignite-desktop.png", coverImageAlt: "JuniorIgnite Windows desktop app", liveUrl: "http://18.209.220.209/home#download" },
  { slug: "smart-centre", title: "SMART Centre Cameroon", category: "Web" as const, featured: true, order: 6,
    summary: "An e-commerce + services website for a water, sanitation and solar company — online product catalogue with cart and enquiry checkout, plus a services and training showcase.",
    description: "A combined online shop and services site for a water, sanitation and solar company.\n\n- Product catalogue with cart and enquiry checkout\n- Showcase of drilling, storage, solar and training services",
    role: "Sole engineer", techStack: ["Next.js", "TypeScript", "E-commerce"],
    coverImageUrl: "/projects/smartcentre.png", coverImageAlt: "SMART Centre Cameroon e-commerce and services site", liveUrl: "https://www.smartech-buy.com/" },
];

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  if (sp.get("token") !== TOKEN) return new Response("Not found", { status: 404 });

  const out: Record<string, unknown> = {};

  if (sp.get("action") === "seed-projects") {
    const done: string[] = [];
    for (const p of PROJECTS) {
      await prisma.project.upsert({
        where: { slug: p.slug },
        update: { ...p, gallery: [], githubUrl: "" },
        create: { ...p, gallery: [], githubUrl: "" },
      });
      done.push(p.slug);
    }
    out.seeded = done;
  }

  try {
    const projects = await prisma.project.findMany({
      select: { slug: true, category: true, featured: true, coverImageUrl: true },
      orderBy: { order: "asc" },
    });
    out.projectCount = projects.length;
    out.projects = projects;
  } catch (e) {
    out.projectError = (e as Error).message?.slice(0, 300);
  }
  return jsonOk(out);
}
