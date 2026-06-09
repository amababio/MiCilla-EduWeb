import { redirect } from "next/navigation";
import { ScheduleManager } from "@/components/admin/ScheduleManager";
import { getScheduleForAdmin } from "@/lib/actions/schedule";
import { getAdminSession } from "@/lib/auth";

export default async function SchedulePage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const schedule = await getScheduleForAdmin(session.schoolId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Schedule</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Manage classes, timetables, exam dates, term calendar events, and daily
          routines for crèche and KG. Published items appear in the Schedule section
          on your public website.
        </p>
      </div>

      <ScheduleManager {...schedule} />
    </div>
  );
}
