interface RankBadgeProps {
  rank: number;
}

export function RankBadge({ rank }: RankBadgeProps) {
  if (rank > 3) {
    return (
      <span className="w-8 text-center text-[14px] font-semibold text-text-secondary tabular-nums">
        {rank}
      </span>
    );
  }

  const medals: Record<number, { emoji: string; bg: string }> = {
    1: { emoji: "\u{1F947}", bg: "bg-[#FFD700]/10" },
    2: { emoji: "\u{1F948}", bg: "bg-[#C0C0C0]/10" },
    3: { emoji: "\u{1F949}", bg: "bg-[#CD7F32]/10" },
  };

  const medal = medals[rank];

  return (
    <span
      className={`w-8 h-8 flex items-center justify-center rounded-full text-[16px] ${medal.bg}`}
    >
      {medal.emoji}
    </span>
  );
}
