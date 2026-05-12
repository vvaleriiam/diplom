export function SkeletonGrid() {
  return (
    <div className="mb-10">
      <div className="skeleton mb-4 h-6 w-36 rounded" />
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-48 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-panel">
            <div className="skeleton aspect-[3/2]" />
            <div className="space-y-2 p-3">
              <div className="skeleton h-3.5 w-3/4 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
