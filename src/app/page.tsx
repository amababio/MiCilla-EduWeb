import { notFound } from "next/navigation";
import { SchoolHomePage } from "@/components/public-site/SchoolHomePage";
import { getPublicSchoolData } from "@/lib/get-public-school-data";
import { getDefaultSchoolSlug } from "@/lib/school-slug";

/** Regenerate the cached homepage every 5 minutes when content changes. */
export const revalidate = 300;

export default async function Home() {
  const school = await getPublicSchoolData(getDefaultSchoolSlug());

  if (!school) {
    notFound();
  }

  return <SchoolHomePage school={school} />;
}
