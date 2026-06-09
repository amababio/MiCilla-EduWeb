type SectionEmptyStateProps = {
  message: string;
  hint?: string;
};

export function SectionEmptyState({ message, hint }: SectionEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-mauve-200 bg-white/80 px-6 py-10 text-center">
      <p className="text-sm font-medium text-slate-700">{message}</p>
      {hint ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
