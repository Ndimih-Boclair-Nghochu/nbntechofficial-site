import { AdminHeader } from "@/components/admin/AdminUI";
import { ContentForm } from "@/components/admin/ContentForm";
import { getSiteContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const content = await getSiteContent();
  return (
    <div>
      <AdminHeader
        title="Site content"
        description="Edit the hero, about, contact and SEO copy shown across the public site — no redeploy needed."
      />
      <ContentForm initial={content} />
    </div>
  );
}
