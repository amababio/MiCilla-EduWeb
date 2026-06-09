import { buildBrandStyleBlock, normalizeBrandColor } from "@/lib/school-profile";

type SchoolBrandStylesProps = {
  brandColor: string;
};

export function SchoolBrandStyles({ brandColor }: SchoolBrandStylesProps) {
  const css = buildBrandStyleBlock(
    normalizeBrandColor(brandColor) ?? "#cf85ef",
  );

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
