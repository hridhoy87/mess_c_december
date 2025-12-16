import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("messc_session")?.value;

  if (!token) {
    return NextResponse.json(
      { detail: "Not authenticated" },
      { status: 401 }
    );
  }

  const r = await fetch(`${process.env.PY_API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await r.json().catch(() => null);

  return NextResponse.json(
    data ?? { detail: "Bad response" },
    { status: r.status }
  );
}
