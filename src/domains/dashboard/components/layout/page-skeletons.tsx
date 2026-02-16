import {
  StatsCardSkeleton,
  ChartCardSkeleton,
  TableCardSkeleton,
} from "@/shared/ui";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="h-8 w-24 skeleton rounded-[4px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ChartCardSkeleton />
        </div>
        <div className="lg:col-span-2">
          <TableCardSkeleton rows={5} />
        </div>
      </div>
    </div>
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="h-8 w-28 skeleton rounded-[4px]" />
      <StatsCardSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TableCardSkeleton rows={8} />
        </div>
        <div className="lg:col-span-1">
          <ChartCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function PnlSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="h-8 w-24 skeleton rounded-[4px]" />
      <ChartCardSkeleton />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function TaxSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="h-8 w-24 skeleton rounded-[4px]" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsCardSkeleton />
        <TableCardSkeleton rows={5} />
      </div>
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="h-8 w-24 skeleton rounded-[4px]" />
      <TableCardSkeleton rows={10} />
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="h-8 w-16 skeleton rounded-[4px]" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TableCardSkeleton rows={3} />
        <StatsCardSkeleton />
      </div>
    </div>
  );
}

export function RewardsSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="h-8 w-24 skeleton rounded-[4px]" />
      <StatsCardSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsCardSkeleton />
        <TableCardSkeleton rows={3} />
      </div>
    </div>
  );
}

export function ReferralSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="h-8 w-16 skeleton rounded-[4px]" />
      <StatsCardSkeleton />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <TableCardSkeleton rows={5} />
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="h-8 w-28 skeleton rounded-[4px]" />
      <StatsCardSkeleton />
      <TableCardSkeleton rows={10} />
    </div>
  );
}
