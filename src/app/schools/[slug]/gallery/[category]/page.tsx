import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryCategoryPage } from "@/components/public-site/GalleryCategoryPage";
import { getGalleryCategoryPageData } from "@/lib/get-gallery-category-page";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string; category: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, category } = await params;
  const data = await getGalleryCategoryPageData(slug, category);

  if (!data) {
    return { title: "Gallery Not Found" };
  }

  return {
    title: `${data.category} Photos | ${data.schoolName}`,
    description: `Browse ${data.photos.length} photos from ${data.category} at ${data.schoolName}.`,
  };
}

export default async function SchoolGalleryCategoryPage({ params }: PageProps) {
  const { slug, category } = await params;
  const data = await getGalleryCategoryPageData(slug, category);

  if (!data) {
    notFound();
  }

  return <GalleryCategoryPage data={data} />;
}
