import { unstable_noStore as noStore } from "next/cache";
import {
  findGalleryCategoryBySlug,
  type GalleryPhotoRecord,
} from "@/lib/gallery-categories";
import { getDefaultSchoolSlug } from "@/lib/school-slug";
import { prisma } from "@/lib/prisma";

export type GalleryCategoryPageData = {
  slug: string;
  schoolName: string;
  category: string;
  categorySlug: string;
  accentClass: string;
  photos: { title: string; imageUrl: string }[];
};

async function fetchGalleryPhotos(schoolSlug: string): Promise<{
  school: { slug: string; name: string } | null;
  photos: GalleryPhotoRecord[];
}> {
  noStore();

  const school = await prisma.school.findFirst({
    where: { slug: schoolSlug, isActive: true },
    select: {
      slug: true,
      name: true,
      galleryImages: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          title: true,
          category: true,
          imageUrl: true,
          accentClass: true,
          isFeatured: true,
          sortOrder: true,
        },
      },
    },
  });

  if (!school) {
    return { school: null, photos: [] };
  }

  return {
    school: { slug: school.slug, name: school.name },
    photos: school.galleryImages,
  };
}

export async function getGalleryCategoryPageData(
  schoolSlug: string,
  categorySlug: string,
): Promise<GalleryCategoryPageData | null> {
  const { school, photos } = await fetchGalleryPhotos(schoolSlug);

  if (!school) {
    return null;
  }

  const group = findGalleryCategoryBySlug(photos, categorySlug);
  if (!group) {
    return null;
  }

  return {
    slug: school.slug,
    schoolName: school.name,
    category: group.category,
    categorySlug: group.slug,
    accentClass: group.accentClass,
    photos: group.publishedPhotos.map((photo) => ({
      title: photo.title,
      imageUrl: photo.imageUrl!,
    })),
  };
}

export async function getGalleryCategoryPageDataForDefaultSchool(
  categorySlug: string,
): Promise<GalleryCategoryPageData | null> {
  return getGalleryCategoryPageData(getDefaultSchoolSlug(), categorySlug);
}
