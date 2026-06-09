import { redirect } from "next/navigation";
import { AchievementsManager } from "@/components/admin/AchievementsManager";
import {
  getAchievementSectionForAdmin,
  getAchievementsForAdmin,
} from "@/lib/actions/achievements";
import { getAdminSession } from "@/lib/auth";

export default async function AchievementsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [achievements, section] = await Promise.all([
    getAchievementsForAdmin(session.schoolId),
    getAchievementSectionForAdmin(session.schoolId),
  ]);

  if (!section) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Achievements
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Manage excellence highlights for your public website. Add BECE results,
          competitions, awards, and innovation entries with privacy-safe display
          options.
        </p>
      </div>

      <AchievementsManager achievements={achievements} section={section} />
    </div>
  );
}
