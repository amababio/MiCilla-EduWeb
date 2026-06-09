import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth-session";
import {
  SUPER_ADMIN_SESSION_COOKIE_NAME,
  verifySuperAdminSessionToken,
} from "@/lib/super-admin-auth-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/super-admin")) {
    const superToken = request.cookies.get(
      SUPER_ADMIN_SESSION_COOKIE_NAME,
    )?.value;
    const superSession = superToken
      ? await verifySuperAdminSessionToken(superToken)
      : null;

    if (pathname === "/super-admin/login") {
      if (superSession) {
        return NextResponse.redirect(
          new URL("/super-admin/dashboard", request.url),
        );
      }
      return NextResponse.next();
    }

    if (!superSession) {
      const loginUrl = new URL("/super-admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/super-admin", "/super-admin/:path*"],
};
