import type { ReferredFriend } from "@/core/types";

interface InvitedFriendsListProps {
  friends: ReferredFriend[];
}

export function InvitedFriendsList({ friends }: InvitedFriendsListProps) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-4">
        초대한 친구
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-text-muted text-left">
              <th className="pb-3 font-medium">주소</th>
              <th className="pb-3 font-medium">가입일</th>
              <th className="pb-3 font-medium text-right">거래량</th>
              <th className="pb-3 font-medium text-right">수익</th>
              <th className="pb-3 font-medium text-right">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {friends.map((friend) => (
              <tr key={friend.address}>
                <td className="py-3 font-mono text-text-primary">
                  {friend.address}
                </td>
                <td className="py-3 text-text-secondary">
                  {new Date(friend.joinedAt).toLocaleDateString("ko-KR")}
                </td>
                <td className="py-3 text-right text-text-primary tabular-nums">
                  ${friend.volume.toLocaleString()}
                </td>
                <td className="py-3 text-right text-positive tabular-nums font-medium">
                  ${friend.earned.toLocaleString()}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[12px] font-medium ${
                      friend.status === "active"
                        ? "text-positive bg-positive-bg"
                        : "text-text-muted bg-bg-surface-3"
                    }`}
                  >
                    {friend.status === "active" ? "활성" : "비활성"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
