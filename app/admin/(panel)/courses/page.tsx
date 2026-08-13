import { AdminHeader } from "@/components/admin/AdminUI";
import { CoursesManager } from "@/components/admin/CoursesManager";
import { getAllCoursesAdmin } from "@/lib/courses-data";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await getAllCoursesAdmin();
  return (
    <div>
      <AdminHeader
        title="Online Courses"
        description="Add and edit affiliate courses (Udemy, Coursera and more). Paste the network-generated affiliate URL per course — never fabricate ratings, prices or reviews."
      />
      <CoursesManager initial={courses} />
    </div>
  );
}
