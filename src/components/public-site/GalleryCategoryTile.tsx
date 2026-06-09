import Link from "next/link";
import { CategoryPhotoCarousel } from "@/components/public-site/CategoryPhotoCarousel";
import { getGalleryCategoryPath } from "@/lib/gallery-urls";
import type { GalleryCategoryPreview } from "@/types/public-site";

type GalleryCategoryTileProps = {
  schoolSlug: string;
  category: GalleryCategoryPreview;
  priority?: boolean;
};

export function GalleryCategoryTile({
  schoolSlug,
  category,
  priority = false,
}: GalleryCategoryTileProps) {
  const href = getGalleryCategoryPath(schoolSlug, category.slug);

  return (
    <Link
      href={href}
      className="motion-gallery-card motion-card group block overflow-hidden rounded-2xl border border-mauve-200 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve-400"
    >
      <div className="motion-gallery-media relative aspect-[4/3] overflow-hidden">
        {category.photos.length > 0 ? (
          <CategoryPhotoCarousel
            photos={category.photos}
            priority={priority}
          />
        ) : (
          <div
            className={`flex h-full items-end bg-gradient-to-br ${category.accent} p-5`}
          >
            <p className="text-sm font-semibold text-white">{category.category}</p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-lg font-semibold">{category.category}</p>
          <p className="mt-1 text-sm text-white/85">
            {category.photoCount} photo{category.photoCount === 1 ? "" : "s"} · Tap
            to view all
          </p>
        </div>
      </div>
    </Link>
  );
}
