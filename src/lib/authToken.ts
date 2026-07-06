const SECRET = process.env.AUTH_SESSION_SECRET ?? "renumber-dev-secret-change-me";
const MESSAGE = "renumber-session-v1";

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateSessionToken(): Promise<string> {
  return hmac(MESSAGE);
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const expected = await generateSessionToken();
  return token === expected;
}

export const SESSION_COOKIE_NAME = "renumber_session";
