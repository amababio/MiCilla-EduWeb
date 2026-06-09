import { SchoolImage } from "@/components/shared/SchoolImage";
import { SectionEmptyState } from "@/components/shared/SectionEmptyState";
import type { PublicSchoolData } from "@/types/public-site";
import { SectionHeading } from "@/components/shared/SectionHeading";

type GalleryPreviewProps = {
  school: PublicSchoolData;
};

export function GalleryPreview({ school }: GalleryPreviewProps) {
  return (
    <section id="gallery" className="bg-mauve-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="School Life in Pictures"
          subtitle="A glimpse of learning, culture, sports, and celebration at our school."
        />

        {school.gallery.length === 0 ? (
          <SectionEmptyState
            message="Gallery photos will appear here soon."
            hint="The school office is preparing photos of classrooms, events, and school life."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {school.gallery.map((item) => (
              <article
                key={`${item.title}-${item.category}`}
                className="group overflow-hidden rounded-2xl border border-mauve-200 bg-white shadow-sm"
              >
                {item.imageUrl ? (
                  <SchoolImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
                    fallback={
                      <div
                        className={`flex aspect-[4/3] items-end bg-gradient-to-br ${item.accent} p-5`}
                      >
                        <div className="rounded-xl bg-black/20 px-3 py-2 backdrop-blur-sm">
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <p className="text-xs text-white/80">{item.category}</p>
                        </div>
                      </div>
                    }
                  />
                ) : (
                  <div
                    className={`flex aspect-[4/3] items-end bg-gradient-to-br ${item.accent} p-5`}
                  >
                    <div className="rounded-xl bg-black/20 px-3 py-2 backdrop-blur-sm">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-white/80">{item.category}</p>
                    </div>
                  </div>
                )}
                {item.imageUrl ? (
                  <div className="border-t border-mauve-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-mauve-700">{item.category}</p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
