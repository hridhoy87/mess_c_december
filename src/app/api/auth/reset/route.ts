import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  if (!token || String(newPassword || "").length < 6) {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }

  // TEMP: later verify token from DB, set password in DB
  return NextResponse.json({ ok: true });
}
