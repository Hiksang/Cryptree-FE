"use client";

import { useReferral } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { ReferralCodeCard } from "@/domains/dashboard";
import { ReferralStats } from "@/domains/dashboard";
import { InvitedFriendsList } from "@/domains/dashboard";
import { ShareButtons } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { StatsCardSkeleton, TableCardSkeleton } from "@/shared/ui";

export default function ReferralPage() {
  const { data, isLoading, isError, refetch } = useReferral();

  if (isLoading) {
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

  if (isError || !data) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">추천</h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        추천
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReferralCodeCard code={data.code} />
        <ShareButtons code={data.code} />
      </div>

      <ReferralStats stats={data.stats} />
      <InvitedFriendsList friends={data.friends} />
    </div>
  );
}
