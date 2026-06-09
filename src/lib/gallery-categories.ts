export type GalleryPhotoRecord = {
  id: string;
  title: string;
  category: string;
  imageUrl: string | null;
  accentClass: string;
  isFeatured: boolean;
  sortOrder: number;
};

export type GalleryCategoryGroup = {
  category: string;
  slug: string;
  accentClass: string;
  photos: GalleryPhotoRecord[];
  featuredPhotos: GalleryPhotoRecord[];
  publishedPhotos: GalleryPhotoRecord[];
};

const CAROUSEL_PHOTO_LIMIT = 24;

export function slugifyGalleryCategory(category: string): string {
  return category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function groupGalleryPhotosByCategory(
  photos: GalleryPhotoRecord[],
): GalleryCategoryGroup[] {
  const groups = new Map<string, GalleryCategoryGroup>();

  for (const photo of photos) {
    const category = photo.category.trim() || "General";
    const slug = slugifyGalleryCategory(category);

    const existing = groups.get(slug);
    if (existing) {
      existing.photos.push(photo);
      if (photo.imageUrl) {
        existing.publishedPhotos.push(photo);
      }
      if (photo.isFeatured && photo.imageUrl) {
        existing.featuredPhotos.push(photo);
      }
      continue;
    }

    groups.set(slug, {
      category,
      slug,
      accentClass: photo.accentClass,
      photos: [photo],
      publishedPhotos: photo.imageUrl ? [photo] : [],
      featuredPhotos: photo.isFeatured && photo.imageUrl ? [photo] : [],
    });
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      photos: sortGalleryPhotos(group.photos),
      publishedPhotos: sortGalleryPhotos(group.publishedPhotos),
      featuredPhotos: sortGalleryPhotos(group.featuredPhotos),
    }))
    .filter((group) => group.publishedPhotos.length > 0)
    .sort((a, b) => compareCategories(a, b));
}

function sortGalleryPhotos(photos: GalleryPhotoRecord[]): GalleryPhotoRecord[] {
  return [...photos].sort((a, b) => a.sortOrder - b.sortOrder);
}

function compareCategories(a: GalleryCategoryGroup, b: GalleryCategoryGroup): number {
  const orderDiff =
    (a.photos[0]?.sortOrder ?? 0) - (b.photos[0]?.sortOrder ?? 0);
  if (orderDiff !== 0) {
    return orderDiff;
  }

  return a.category.localeCompare(b.category);
}

export function getHomepageGalleryCategories(
  photos: GalleryPhotoRecord[],
): GalleryCategoryGroup[] {
  return groupGalleryPhotosByCategory(photos).filter(
    (group) => group.featuredPhotos.length > 0,
  );
}

export function getCarouselPhotos(group: GalleryCategoryGroup) {
  const pool =
    group.featuredPhotos.length > 0 ? group.featuredPhotos : group.publishedPhotos;

  return pool.slice(0, CAROUSEL_PHOTO_LIMIT).map((photo) => ({
    imageUrl: photo.imageUrl!,
    title: photo.title,
  }));
}

export function findGalleryCategoryBySlug(
  photos: GalleryPhotoRecord[],
  categorySlug: string,
): GalleryCategoryGroup | null {
  return (
    groupGalleryPhotosByCategory(photos).find(
      (group) => group.slug === categorySlug,
    ) ?? null
  );
}
