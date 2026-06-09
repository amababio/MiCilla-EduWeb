import { notFound } from "next/navigation";
import { SchoolHomePage } from "@/components/public-site/SchoolHomePage";
import { getPublicSchoolData } from "@/lib/get-public-school-data";
import { getDefaultSchoolSlug } from "@/lib/school-slug";

export const dynamic = "force-dynamic";

export default async function Home() {
  const school = await getPublicSchoolData(getDefaultSchoolSlug());

  if (!school) {
    notFound();
  }

  return <SchoolHomePage school={school} />;
}
