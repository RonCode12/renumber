import { NextResponse } from "next/server";
import { generateSessionToken, SESSION_COOKIE_NAME } from "@/lib/authToken";

const USER = process.env.BASIC_AUTH_USER ?? "renumber";
const PASSWORD = process.env.BASIC_AUTH_PASSWORD ?? "medias";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = body?.username ?? "";
  const password = body?.password ?? "";

  if (username !== USER || password !== PASSWORD) {
    return NextResponse.json({ error: "שם משתמש או סיסמה שגויים" }, { status: 401 });
  }

  const token = await generateSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
