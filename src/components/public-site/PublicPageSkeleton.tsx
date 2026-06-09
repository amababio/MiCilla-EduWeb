export function PublicPageSkeleton() {
  return (
    <div className="animate-pulse bg-mauve-50" aria-busy="true" aria-label="Loading school website">
      <div className="border-b border-mauve-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-mauve-200" />
          <div className="h-5 w-48 max-w-[60%] rounded bg-mauve-200" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-mauve-200" />
            <div className="h-10 w-full max-w-md rounded bg-mauve-200" />
            <div className="h-6 w-full max-w-sm rounded bg-mauve-200" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-mauve-100" />
              <div className="h-4 w-5/6 rounded bg-mauve-100" />
              <div className="h-4 w-4/6 rounded bg-mauve-100" />
            </div>
            <div className="flex gap-3 pt-4">
              <div className="h-11 w-36 rounded-full bg-mauve-300" />
              <div className="h-11 w-36 rounded-full bg-mauve-200" />
            </div>
          </div>
          <div className="aspect-[4/3] rounded-3xl bg-mauve-200" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-4 px-4 pb-16 sm:px-6">
        <div className="mx-auto h-8 w-56 rounded bg-mauve-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-40 rounded-2xl bg-mauve-100" />
          <div className="h-40 rounded-2xl bg-mauve-100" />
          <div className="h-40 rounded-2xl bg-mauve-100" />
        </div>
      </div>
    </div>
  );
}
