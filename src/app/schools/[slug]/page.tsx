import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SchoolHomePage } from "@/components/public-site/SchoolHomePage";
import { getPublicSchoolData } from "@/lib/get-public-school-data";
import { prisma } from "@/lib/prisma";

/** Regenerate cached school pages every 5 minutes when content changes. */
export const revalidate = 300;

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
