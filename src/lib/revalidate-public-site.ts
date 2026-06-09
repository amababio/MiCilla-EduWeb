import { revalidatePath, refresh } from "next/cache";
import { getSchoolPublicPath } from "@/lib/school-slug";

/** Invalidate cached public pages for the default homepage and a school's slug route. */
export function revalidatePublicSchoolPages(schoolSlug: string) {
  revalidatePath("/", "page");
  revalidatePath(getSchoolPublicPath(schoolSlug), "page");
  refresh();
}
