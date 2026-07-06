import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  isValidAdminSessionToken,
  isValidSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/authToken";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(sessionToken))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    if (!(await isValidAdminSessionToken(adminToken))) {
      const adminLoginUrl = new URL("/admin/login", request.url);
      adminLoginUrl.searchParams.set("next", pathname + search);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|api/login|admin/login|api/admin-login|_next/static|_next/image|favicon.ico|logo.png).*)",
  ],
};
