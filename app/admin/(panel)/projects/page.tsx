import { AdminHeader } from "@/components/admin/AdminUI";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return (
    <div>
      <AdminHeader
        title="Projects"
        description="Create and edit case studies. Toggle 'featured' to surface a project on the home page."
      />
      <ProjectsManager initial={projects} />
    </div>
  );
}
