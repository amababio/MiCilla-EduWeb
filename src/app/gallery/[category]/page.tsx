import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Header,
  PUBLIC_SITE_HEADER_OFFSET_CLASS,
} from "@/components/public-site/Header";
import { GalleryCategoryPage } from "@/components/public-site/GalleryCategoryPage";
import { MobileContactBar } from "@/components/public-site/MobileContactBar";
import { SchoolBrandStyles } from "@/components/public-site/SchoolBrandStyles";
import { getGalleryCategoryPageDataForDefaultSchool } from "@/lib/get-gallery-category-page";
import { getPublicSchoolData } from "@/lib/get-public-school-data";
import { getDefaultSchoolSlug } from "@/lib/school-slug";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const data = await getGalleryCategoryPageDataForDefaultSchool(category);

  if (!data) {
    return { title: "Gallery Not Found" };
  }

  return {
    title: `${data.category} Photos | ${data.schoolName}`,
    description: `Browse ${data.photos.length} photos from ${data.category} at ${data.schoolName}.`,
  };
}

export default async function DefaultSchoolGalleryCategoryPage({
  params,
}: PageProps) {
  const { category } = await params;
  const [data, school] = await Promise.all([
    getGalleryCategoryPageDataForDefaultSchool(category),
    getPublicSchoolData(getDefaultSchoolSlug()),
  ]);

  if (!data || !school) {
    notFound();
  }

  return (
    <>
      <SchoolBrandStyles brandColor={school.brandColor} />
      <Header school={school} />
      <main className={PUBLIC_SITE_HEADER_OFFSET_CLASS}>
        <GalleryCategoryPage data={data} />
      </main>
      <MobileContactBar school={school} />
    </>
  );
}
