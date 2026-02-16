import { SkeletonLine, SkeletonBlock } from "./skeleton";

export function StatsCardSkeleton() {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6 space-y-3">
      <SkeletonLine className="w-20 h-3" />
      <SkeletonLine className="w-32 h-7" />
      <SkeletonLine className="w-16 h-4" />
    </div>
  );
}

export function ChartCardSkeleton() {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6 space-y-4">
      <SkeletonLine className="w-32 h-5" />
      <SkeletonBlock className="w-full h-[200px]" />
    </div>
  );
}

export function TableCardSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6 space-y-3">
      <SkeletonLine className="w-40 h-5" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <SkeletonLine className="w-8 h-4" />
          <SkeletonLine className="flex-1 h-4" />
          <SkeletonLine className="w-20 h-4" />
        </div>
      ))}
    </div>
  );
}
