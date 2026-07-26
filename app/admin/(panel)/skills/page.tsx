import { AdminHeader } from "@/components/admin/AdminUI";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { getSkills } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getSkills();
  return (
    <div>
      <AdminHeader
        title="Skills"
        description="Your tech stack, grouped by category and shown on the home page. Use the order number to sort within a category."
      />
      <SkillsManager initial={skills} />
    </div>
  );
}
