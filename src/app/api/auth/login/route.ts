import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const r = await fetch(`${process.env.PY_API_BASE}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => null);

  if (!r.ok) {
    return NextResponse.json(data ?? { detail: "Login failed" }, { status: r.status });
  }

  const token = data?.access_token;
  if (!token) {
    return NextResponse.json({ detail: "No access_token returned" }, { status: 500 });
  }

  // Optional: verify token immediately by calling /me (strong debugging signal)
  const meRes = await fetch(`${process.env.PY_API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const me = await meRes.json().catch(() => null);

  const res = NextResponse.json({ ok: true, me });

  res.cookies.set({
    name: "messc_session",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true in prod
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
