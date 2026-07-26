import Link from "next/link";
import {
  FolderKanban,
  Wrench,
  Star,
  Inbox,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { auth } from "@/auth";
import { getAdminCounts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  const counts = await getAdminCounts();

  const stats = [
    { label: "Projects", value: counts.projects, href: "/admin/projects", icon: FolderKanban },
    { label: "Skills", value: counts.skills, href: "/admin/skills", icon: Wrench },
    {
      label: counts.pendingReviews > 0 ? "Reviews · pending" : "Reviews",
      value: counts.pendingReviews > 0 ? counts.pendingReviews : counts.testimonials,
      href: "/admin/testimonials",
      icon: Star,
      highlight: counts.pendingReviews > 0,
    },
    {
      label: "Unread messages",
      value: counts.unreadMessages,
      href: "/admin/messages",
      icon: Inbox,
      highlight: counts.unreadMessages > 0,
    },
  ];

  const quickLinks = [
    { label: "Add a project", href: "/admin/projects", desc: "Publish a new case study with images." },
    { label: "Approve reviews", href: "/admin/testimonials", desc: "Review and publish visitor submissions." },
    { label: "Read messages", href: "/admin/messages", desc: "Enquiries from the contact form." },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-1.5 text-sm text-ink-body">
          Here&apos;s what&apos;s live on your site right now.
        </p>
      </div>

      {!counts.ok && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Database not reachable.</p>
            <p className="mt-0.5">
              The site is serving default placeholder content. Set{" "}
              <code className="rounded bg-amber-100 px-1">DATABASE_URL</code> and run the
              migration + seed to enable editing. See the README.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group rounded-xl2 border border-ink-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-cyan/40 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy group-hover:bg-cyan/10 group-hover:text-cyan-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-4 font-serif text-3xl font-semibold text-ink">{s.value}</p>
              <p className="text-sm text-ink-muted">{s.label}</p>
            </Link>
          );
        })}
      </div>

      <h2 className="mb-4 mt-10 text-sm font-semibold uppercase tracking-wider text-ink-muted">
        Quick actions
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {quickLinks.map((q) => (
          <Link
            key={q.href + q.label}
            href={q.href}
            className="group rounded-xl2 border border-ink-line bg-surface p-5 shadow-card transition-colors hover:border-cyan/40"
          >
            <p className="font-medium text-ink group-hover:text-cyan-deep">{q.label}</p>
            <p className="mt-1 text-sm text-ink-body">{q.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
