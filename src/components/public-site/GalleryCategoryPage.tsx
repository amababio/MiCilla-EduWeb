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
    <div className="min-h-screen bg-mauve-50">
      <header className="border-b border-mauve-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-mauve-600">
              {data.schoolName}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              {data.category}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {data.photos.length} photo{data.photos.length === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            href={homeHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-mauve-300 bg-white px-5 py-2.5 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-50"
          >
            Back to gallery
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
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
      </main>
    </div>
  );
}
