import { redirect } from "next/navigation";
import { SchoolProfileForm } from "@/components/admin/SchoolProfileForm";
import { getAdminSession } from "@/lib/auth";
import { getSchoolProfileForAdmin } from "@/lib/actions/school-profile";

export default async function SchoolProfilePage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const profile = await getSchoolProfileForAdmin(session.schoolId);

  if (!profile) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          School Profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Update your school name, contact details, logo, and brand color. Changes
          appear on your public website after you save.
        </p>
      </div>

      <SchoolProfileForm profile={profile} />
    </div>
  );
}
