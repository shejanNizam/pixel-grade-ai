import { NextResponse } from "next/server";

// This template is frontend-only (no backend), so every route is public.
//
// To re-enable auth gating later, read your auth cookie/token here and
// redirect based on it. For example:
//
//   export function middleware(request: NextRequest) {
//     const token = request.cookies.get("auth-token")?.value;
//     const { pathname } = request.nextUrl;
//     const isProtected = pathname.startsWith("/user-dashboard") ||
//       pathname.startsWith("/admin");
//     if (isProtected && !token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//     return NextResponse.next();
//   }
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)",
  ],
};
