import { phoneToTel, phoneToWhatsApp } from "@/lib/phone";
import type { PublicSchoolData } from "@/types/public-site";
import { SectionHeading } from "@/components/shared/SectionHeading";

type AdmissionsSectionProps = {
  school: PublicSchoolData;
};

export function AdmissionsSection({ school }: AdmissionsSectionProps) {
  const admissionForm = school.downloads.find(
    (item) => item.category === "admission_form" && item.fileUrl,
  );

  return (
    <section id="admissions" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title={school.admissions.headline}
          subtitle={school.admissions.description}
        />

        <div className="rounded-2xl border border-mauve-200 bg-mauve-100/70 p-6 sm:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-mauve-700">
            Available Levels
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {school.admissions.levels.map((level) => (
              <span
                key={level}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-mauve-200"
              >
                {level}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {admissionForm ? (
              <a
                href={admissionForm.fileUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-mauve-600"
              >
                Download Admission Form
              </a>
            ) : (
              <span className="inline-flex items-center justify-center rounded-full border border-mauve-200 bg-white px-6 py-3 text-sm font-semibold text-slate-500">
                Admission form link coming soon
              </span>
            )}
            <a
              href={phoneToTel(school.phone)}
              className="inline-flex items-center justify-center rounded-full border-2 border-mauve-300 bg-white px-6 py-3 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-50"
            >
              Call Admissions Office
            </a>
            <a
              href={phoneToWhatsApp(school.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-mauve-600"
            >
              WhatsApp Admissions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
