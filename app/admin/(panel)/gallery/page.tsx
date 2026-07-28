import { AdminHeader } from "@/components/admin/AdminUI";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { getGalleryImages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();
  return (
    <div>
      <AdminHeader
        title="Gallery"
        description="Upload photos for the public gallery page. Give each a clear alt text (with your name) so they show up in image search. Tick 'Show on home' to feature a photo on the home page."
      />
      <GalleryManager initial={images} />
    </div>
  );
}
