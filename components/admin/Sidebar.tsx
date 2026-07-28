"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  FileText,
  Star,
  Inbox,
  Images,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

export function Sidebar({
  email,
  pendingReviews = 0,
  unreadMessages = 0,
}: {
  email?: string | null;
  pendingReviews?: number;
  unreadMessages?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, badge: 0 },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban, badge: 0 },
    { href: "/admin/skills", label: "Skills", icon: Wrench, badge: 0 },
    { href: "/admin/gallery", label: "Gallery", icon: Images, badge: 0 },
    { href: "/admin/content", label: "Site content", icon: FileText, badge: 0 },
    { href: "/admin/testimonials", label: "Reviews", icon: Star, badge: pendingReviews },
    { href: "/admin/messages", label: "Messages", icon: Inbox, badge: unreadMessages },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const linkList = (
    <nav className="flex flex-1 flex-col gap-1">
      {nav.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-cyan/10 text-cyan-deep"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {item.label}
            {item.badge > 0 && (
              <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cyan px-1.5 text-xs font-bold text-navy-950">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-navy-950 px-4 py-3 lg:hidden">
        <span className="inline-flex rounded-lg bg-white/95 px-2 py-1">
          <Logo height={28} />
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar (desktop fixed, mobile drawer) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-950 p-4 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="mb-6 hidden px-2 pt-2 lg:block">
          <span className="inline-flex rounded-lg bg-white/95 px-2.5 py-1.5">
            <Logo height={30} />
          </span>
        </div>

        {linkList}

        <div className="mt-4 border-t border-white/10 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-[18px] w-[18px]" />
            View live site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
          {email && (
            <p className="mt-3 truncate px-3 text-xs text-white/40" title={email}>
              {email}
            </p>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-hidden
        />
      )}
    </>
  );
}
