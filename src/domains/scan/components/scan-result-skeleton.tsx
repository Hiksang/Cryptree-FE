"use client";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`skeleton rounded-[6px] ${className ?? ""}`} />;
}

export function ScanResultSkeleton() {
  return (
    <div className="max-w-[960px] mx-auto px-4 py-6 animate-fade-in">
      {/* Top navigation skeleton */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <SkeletonBlock className="h-5 w-12" />
        <SkeletonBlock className="h-8 w-32 rounded-[6px]" />
      </div>

      {/* Address skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-5 w-5 rounded-full" />
      </div>

      {/* Tab bar skeleton */}
      <div className="flex gap-4 md:gap-8 border-b border-border-default mb-6">
        <SkeletonBlock className="h-5 w-20 mb-3" />
        <SkeletonBlock className="h-5 w-16 mb-3" />
        <SkeletonBlock className="h-5 w-24 mb-3" />
      </div>

      {/* Two column layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
        {/* Left: Identity Card skeleton */}
        <div>
          <div className="bg-bg-surface border border-border-default rounded-[8px] p-6 space-y-4">
            {/* Tier badge + address */}
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <SkeletonBlock className="h-5 w-40" />
                <SkeletonBlock className="h-4 w-24" />
              </div>
            </div>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="h-6 w-20" />
                </div>
              ))}
            </div>
            {/* DNA bar */}
            <SkeletonBlock className="h-4 w-full rounded-full" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <SkeletonBlock key={i} className="h-4 w-20" />
              ))}
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <SkeletonBlock key={i} className="h-8 w-24 rounded-[6px]" />
            ))}
          </div>
        </div>

        {/* Right: Chain breakdown + Insights */}
        <div className="space-y-6">
          {/* Chain breakdown skeleton */}
          <div className="bg-bg-surface border border-border-default rounded-[8px] p-6 space-y-3">
            <SkeletonBlock className="h-6 w-32 mb-2" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBlock className="h-4 w-4 rounded-full" />
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-3 flex-1 rounded-full" />
                <SkeletonBlock className="h-4 w-12" />
              </div>
            ))}
          </div>

          {/* Insights skeleton */}
          <div className="bg-bg-surface border border-border-default rounded-[8px] p-6 space-y-3">
            <SkeletonBlock className="h-6 w-40 mb-2" />
            {[1, 2, 3].map((i) => (
              <SkeletonBlock key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Transaction table skeleton */}
      <div className="mt-6 bg-bg-surface border border-border-default rounded-[8px] p-4 md:p-6">
        <SkeletonBlock className="h-6 w-48 mb-4" />
        {/* Table header */}
        <div className="grid grid-cols-[60px_1fr_1fr_80px_50px] gap-3 pb-2 border-b border-border-default mb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonBlock key={i} className="h-3 w-full" />
          ))}
        </div>
        {/* Table rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="grid grid-cols-[60px_1fr_1fr_80px_50px] gap-3 items-center h-12"
          >
            <SkeletonBlock className="h-4 w-10" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-16" />
            <SkeletonBlock className="h-4 w-12 ml-auto" />
            <SkeletonBlock className="h-4 w-8 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
