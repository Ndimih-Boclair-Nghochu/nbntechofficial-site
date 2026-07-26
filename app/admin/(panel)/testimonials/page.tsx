import { AdminHeader } from "@/components/admin/AdminUI";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { getTestimonials } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const items = await getTestimonials();
  return (
    <div>
      <AdminHeader
        title="Testimonials"
        description="Client quotes shown on the home page. The whole section is hidden automatically when there are none."
      />
      <TestimonialsManager initial={items} />
    </div>
  );
}
