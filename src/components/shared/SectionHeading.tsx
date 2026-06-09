type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-10 max-w-2xl ${alignClass}`}>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
