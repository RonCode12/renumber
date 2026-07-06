import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME, generateAdminSessionToken } from "@/lib/authToken";

const USER = process.env.ADMIN_AUTH_USER ?? "yon";
const PASSWORD = process.env.ADMIN_AUTH_PASSWORD ?? "654321";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = body?.username ?? "";
  const password = body?.password ?? "";

  if (username !== USER || password !== PASSWORD) {
    return NextResponse.json({ error: "שם משתמש או סיסמה שגויים" }, { status: 401 });
  }

  const token = await generateAdminSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
