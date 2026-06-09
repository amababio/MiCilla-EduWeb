import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryCategoryPage } from "@/components/public-site/GalleryCategoryPage";
import { getGalleryCategoryPageDataForDefaultSchool } from "@/lib/get-gallery-category-page";

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
  const data = await getGalleryCategoryPageDataForDefaultSchool(category);

  if (!data) {
    notFound();
  }

  return <GalleryCategoryPage data={data} />;
}
