import { AdminHeader } from "@/components/admin/AdminUI";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { getTestimonials } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const items = await getTestimonials();
  return (
    <div>
      <AdminHeader
        title="Reviews"
        description="Approve visitor-submitted reviews and manage your own. Pending reviews are highlighted and stay hidden until you approve them."
      />
      <TestimonialsManager initial={items} />
    </div>
  );
}
