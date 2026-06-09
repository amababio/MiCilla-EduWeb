import type { PublicSchoolData } from "@/types/public-site";

type SchoolLogoMarkProps = {
  school: Pick<PublicSchoolData, "initials" | "name" | "logoUrl">;
  className?: string;
  imageClassName?: string;
};

export function SchoolLogoMark({
  school,
  className = "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mauve-500 text-sm font-bold text-white shadow-sm",
  imageClassName = "h-10 w-10 shrink-0 rounded-xl object-cover shadow-sm",
}: SchoolLogoMarkProps) {
  if (school.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={school.logoUrl}
        alt={`${school.name} logo`}
        className={imageClassName}
      />
    );
  }

  return <span className={className}>{school.initials}</span>;
}
