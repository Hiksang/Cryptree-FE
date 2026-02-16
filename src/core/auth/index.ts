import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Privy 키가 설정되어 있으면 privy-token 쿠키 검증,
 * 없으면 인증 거부 (null 반환).
 */
export async function getAuthUserId(): Promise<string | null> {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const privyAppSecret = process.env.PRIVY_APP_SECRET;

  if (!privyAppId || !privyAppSecret) return null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("privy-token")?.value;
    if (!token) return null;

    const { PrivyClient } = await import("@privy-io/server-auth");
    const client = new PrivyClient(privyAppId, privyAppSecret);
    const claims = await client.verifyAuthToken(token);
    return claims.userId;
  } catch {
    return null;
  }
}

/**
 * 인증 실패 시 401 응답 반환 헬퍼
 */
export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
