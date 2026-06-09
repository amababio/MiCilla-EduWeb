import { redirect } from "next/navigation";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { getGalleryPhotosForAdmin } from "@/lib/actions/gallery";
import { getAdminSession } from "@/lib/auth";

export default async function PhotosPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const photos = await getGalleryPhotosForAdmin(session.schoolId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Photos</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Build photo albums by category. Bulk upload graduation or sports photos,
          feature categories for the homepage preview, and let parents open the full
          album from your public website.
        </p>
      </div>

      <GalleryManager photos={photos} />
    </div>
  );
}
