import { SectionEmptyState } from "@/components/shared/SectionEmptyState";
import type { PublicSchoolData } from "@/types/public-site";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GalleryCategoryTile } from "@/components/public-site/GalleryCategoryTile";

type GalleryPreviewProps = {
  school: PublicSchoolData;
};

export function GalleryPreview({ school }: GalleryPreviewProps) {
  return (
    <section id="gallery" className="bg-mauve-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6" data-motion-reveal>
        <SectionHeading
          title="School Life in Pictures"
          subtitle="Browse photo albums from classrooms, events, sports, and celebrations. Hover a category on desktop or scroll to it on your phone to preview photos, then tap to open the full album."
        />

        {school.galleryCategories.length === 0 ? (
          <SectionEmptyState
            message="Gallery albums will appear here soon."
            hint="The school office is preparing photos of classrooms, events, and school life."
          />
        ) : (
          <div className="motion-stagger-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {school.galleryCategories.map((category, index) => (
              <GalleryCategoryTile
                key={category.slug}
                schoolSlug={school.slug}
                category={category}
                priority={index < 2}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
