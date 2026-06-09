import { demoSchool } from "@/data/demoSchool";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function GalleryPreview() {
  return (
    <section id="gallery" className="bg-mauve-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="School Life in Pictures"
          subtitle="A glimpse of learning, culture, sports, and celebration at our school."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoSchool.gallery.map((item) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-2xl border border-mauve-200 bg-white shadow-sm"
            >
              <div
                className={`flex aspect-[4/3] items-end bg-gradient-to-br ${item.accent} p-5`}
              >
                <div className="rounded-xl bg-black/20 px-3 py-2 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/80">Photo placeholder</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
