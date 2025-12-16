// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
const COOKIE_NAME = "messc_session";

export type SessionPayload = {
  sub: string; // user id
  email: string;
  role: "admin" | "frontdesk" | "manager" | "housekeeping";
};

export async function signSession(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as SessionPayload;
}

export function sessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export const SESSION_COOKIE = COOKIE_NAME;

/**
 * TEMP user store (replace with Python later)
 */
export function validateUser(email: string, password: string) {
  // Replace this with DB lookup later
  if (email === "admin@hotel.local" && password === "admin123") {
    return { id: "1", email, role: "admin" as const };
  }
  if (email === "frontdesk@hotel.local" && password === "frontdesk123") {
    return { id: "2", email, role: "frontdesk" as const };
  }
  return null;
}
