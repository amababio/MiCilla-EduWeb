import { SchoolImage } from "@/components/shared/SchoolImage";
import type { PublicSchoolData } from "@/types/public-site";

type SchoolLogoMarkProps = {
  school: Pick<PublicSchoolData, "initials" | "name" | "logoUrl">;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function SchoolLogoMark({
  school,
  className = "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mauve-500 text-sm font-bold text-white shadow-sm",
  imageClassName = "h-10 w-10 shrink-0 rounded-xl object-cover shadow-sm",
  priority = false,
}: SchoolLogoMarkProps) {
  if (school.logoUrl) {
    return (
      <SchoolImage
        src={school.logoUrl}
        alt={`${school.name} logo`}
        className={imageClassName}
        priority={priority}
        fallback={<span className={className}>{school.initials}</span>}
      />
    );
  }

  return <span className={className}>{school.initials}</span>;
}
