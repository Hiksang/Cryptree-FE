import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/dashboard"];

export function proxy(request: NextRequest) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // dev 모드: Privy 키 없으면 보호하지 않음
  if (!privyAppId) return NextResponse.next();

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!isProtected) return NextResponse.next();

  // privy-token 쿠키 존재 확인 (실제 검증은 API 라우트에서)
  const token = request.cookies.get("privy-token")?.value;

  if (!token) {
    const url = new URL("/", request.url);
    url.searchParams.set("login", "required");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
