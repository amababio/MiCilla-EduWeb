import { redirect } from "next/navigation";
import { AnnouncementsManager } from "@/components/admin/AnnouncementsManager";
import { getAnnouncementsForAdmin } from "@/lib/actions/announcements";
import { getAdminSession } from "@/lib/auth";

export default async function NoticesPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const announcements = await getAnnouncementsForAdmin(session.schoolId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Notices</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Manage school announcements and events for your public website. Add
          admissions updates, PTA notices, holidays, and other messages for
          parents.
        </p>
      </div>

      <AnnouncementsManager announcements={announcements} />
    </div>
  );
}
