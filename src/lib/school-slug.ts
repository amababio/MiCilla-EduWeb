export const DEFAULT_SCHOOL_SLUG = "redemption-international-school";

export function getDefaultSchoolSlug(): string {
  return process.env.DEFAULT_SCHOOL_SLUG ?? DEFAULT_SCHOOL_SLUG;
}

export function getSchoolPublicPath(slug: string): string {
  return `/schools/${slug}`;
}
