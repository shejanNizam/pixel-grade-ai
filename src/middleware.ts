import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// SSR route gating from the cookies set at login (see utils/cookieUtils.ts):
//   auth-token — presence gates the two dashboards
//   auth-role  — routes /admin to admins only
//
// This is a ROUTING layer, not the security boundary. Every API endpoint
// re-validates the JWT and the role server-side; forging these cookies
// changes which shell renders, never what data is reachable. Redirecting
// here just avoids flashing a dashboard skeleton at logged-out visitors.
// ---------------------------------------------------------------------------

const ADMIN_ROLES = new Set(["admin", "super_admin"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const role = request.cookies.get("auth-role")?.value ?? "";

  const wantsAdmin = pathname.startsWith("/admin");
  const wantsUserDashboard = pathname.startsWith("/user-dashboard");

  if ((wantsAdmin || wantsUserDashboard) && !token) {
    const login = new URL("/login", request.url);
    // Land the user back where they were headed after signing in.
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (wantsAdmin && !ADMIN_ROLES.has(role)) {
    return NextResponse.redirect(new URL("/user-dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)",
  ],
};
