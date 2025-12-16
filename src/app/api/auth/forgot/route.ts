import { NextResponse } from "next/server";

// TEMP: in real system store token hashed + expiry in DB and email it
export async function POST(req: Request) {
  const { email } = await req.json();

  // Always respond OK (prevents account enumeration)
  const token = Buffer.from(`${email}:${Date.now()}`).toString("base64url");

  return NextResponse.json({
    ok: true,
    // TEMP: show link for dev; later email it
    dev_reset_link: `/reset-password?token=${token}`,
  });
}
