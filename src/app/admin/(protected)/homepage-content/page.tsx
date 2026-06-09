import { redirect } from "next/navigation";
import { HomepageContentForm } from "@/components/admin/HomepageContentForm";
import { getHomepageContentForAdmin } from "@/lib/actions/homepage-content";
import { getAdminSession } from "@/lib/auth";

export default async function HomepageContentPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const content = await getHomepageContentForAdmin(session.schoolId);

  if (!content) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Homepage Content
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Update the welcome message, admissions text, about section, reasons to
          choose your school, and contact messages. Changes appear on your public
          homepage after you save.
        </p>
      </div>

      <HomepageContentForm content={content} />
    </div>
  );
}
