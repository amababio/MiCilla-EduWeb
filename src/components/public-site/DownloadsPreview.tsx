import { SectionEmptyState } from "@/components/shared/SectionEmptyState";
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
          subtitle="Helpful school documents for parents and guardians."
        />

        {school.downloads.length === 0 ? (
          <SectionEmptyState
            message="No downloads available yet."
            hint="Admission forms, prospectus files, and other documents will appear here when published."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {school.downloads.map((item) => (
              <article
                key={`${item.title}-${item.category}`}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <span className="rounded-full bg-mauve-100 px-2.5 py-0.5 text-xs font-semibold text-mauve-800">
                      {item.categoryLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                </div>
                {item.fileUrl ? (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-mauve-300 bg-white px-5 py-2 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-50 sm:mt-0"
                  >
                    Download
                  </a>
                ) : (
                  <span className="mt-4 inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-400 sm:mt-0">
                    Link coming soon
                  </span>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
