import { getDefaultSchoolSlug } from "@/lib/school-slug";

export function getGalleryCategoryPath(
  schoolSlug: string,
  categorySlug: string,
): string {
  const defaultSlug = getDefaultSchoolSlug();

  if (schoolSlug === defaultSlug) {
    return `/gallery/${categorySlug}`;
  }

  return `/schools/${schoolSlug}/gallery/${categorySlug}`;
}
