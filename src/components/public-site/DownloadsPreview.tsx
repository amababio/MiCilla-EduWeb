import type { PublicSchoolData } from "@/types/public-site";
import { SectionHeading } from "@/components/shared/SectionHeading";

type DownloadsPreviewProps = {
  school: PublicSchoolData;
};

export function DownloadsPreview({ school }: DownloadsPreviewProps) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="Downloads"
          subtitle="Helpful school documents for parents and guardians. Demo placeholders only."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {school.downloads.map((item) => (
            <article
              key={item.title}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:gap-4"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </div>
              <button
                type="button"
                className="mt-4 shrink-0 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 sm:mt-0"
                title="Demo placeholder — real downloads come in a later phase"
              >
                Download (Demo)
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
