import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard (defense in depth alongside middleware).
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar email={session.user.email} />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">{children}</div>
      </div>
    </div>
  );
}
