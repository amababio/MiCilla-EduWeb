import { redirect } from "next/navigation";
import { DownloadsManager } from "@/components/admin/DownloadsManager";
import { getDownloadsForAdmin } from "@/lib/actions/downloads";
import { getAdminSession } from "@/lib/auth";

export default async function FilesPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const downloads = await getDownloadsForAdmin(session.schoolId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Files</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Manage downloadable school documents for your public website. Add
          admission forms, prospectus files, book lists, and fee notices using
          file links.
        </p>
      </div>

      <DownloadsManager downloads={downloads} />
    </div>
  );
}
