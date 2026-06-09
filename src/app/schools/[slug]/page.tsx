import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SchoolHomePage } from "@/components/public-site/SchoolHomePage";
import { getPublicSchoolData } from "@/lib/get-public-school-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Only slugs from generateStaticParams are valid; unknown schools return 404. */
export const dynamicParams = false;

type SchoolPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const schools = await prisma.school.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return schools.map((school) => ({ slug: school.slug }));
}

export async function generateMetadata({
  params,
}: SchoolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const school = await getPublicSchoolData(slug);

  if (!school) {
    return { title: "School Not Found" };
  }

  return {
    title: `${school.name} | MiCilla EduWeb`,
    description: school.tagline,
  };
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const { slug } = await params;
  const school = await getPublicSchoolData(slug);

  if (!school) {
    notFound();
  }

  return <SchoolHomePage school={school} />;
}
