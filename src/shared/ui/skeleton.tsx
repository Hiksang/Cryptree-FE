export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton rounded-[4px] h-4 ${className}`} />
  );
}

export function SkeletonCircle({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton rounded-full w-10 h-10 ${className}`} />
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton rounded-[8px] ${className}`} />
  );
}
