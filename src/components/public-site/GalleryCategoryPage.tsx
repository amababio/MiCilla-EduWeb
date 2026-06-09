import Link from "next/link";
import { SchoolImage } from "@/components/shared/SchoolImage";
import { getDefaultSchoolSlug } from "@/lib/school-slug";
import type { GalleryCategoryPageData } from "@/lib/get-gallery-category-page";

type GalleryCategoryPageProps = {
  data: GalleryCategoryPageData;
};

export function GalleryCategoryPage({ data }: GalleryCategoryPageProps) {
  const homeHref =
    data.slug === getDefaultSchoolSlug() ? "/#gallery" : `/schools/${data.slug}#gallery`;

  return (
    <div className="min-h-screen bg-mauve-50 pb-20 lg:pb-10">
      <div className="border-b border-mauve-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Link
            href={homeHref}
            className="inline-flex min-h-10 items-center text-sm font-semibold text-mauve-700 hover:text-mauve-800"
          >
            ← Back to gallery
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-mauve-600">
            {data.schoolName}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            {data.category}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {data.photos.length} photo{data.photos.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.photos.map((photo) => (
            <article
              key={`${photo.imageUrl}-${photo.title}`}
              className="overflow-hidden rounded-2xl border border-mauve-200 bg-white shadow-sm"
            >
              <SchoolImage
                src={photo.imageUrl}
                alt={photo.title}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="border-t border-mauve-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{photo.title}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
