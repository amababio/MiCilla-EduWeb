export function HeroBackgroundShapes() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="motion-hero-shape motion-hero-shape-a absolute -left-16 top-10 h-56 w-56 rounded-full bg-mauve-300/35 blur-3xl" />
      <div className="motion-hero-shape motion-hero-shape-b absolute -right-10 top-1/3 h-72 w-72 rounded-full bg-mauve-400/25 blur-3xl" />
      <div className="motion-hero-shape motion-hero-shape-c absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-mauve-200/50 blur-2xl" />
    </div>
  );
}
