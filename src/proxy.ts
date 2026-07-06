import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidSessionToken, SESSION_COOKIE_NAME } from "@/lib/authToken";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (await isValidSessionToken(token)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!login|api/login|_next/static|_next/image|favicon.ico|logo.png).*)",
  ],
};
