// src/app/api/auth/login/route.ts - UPDATE THIS
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Check if PY_API_BASE is set
  const API_BASE = process.env.PY_API_BASE;
  if (!API_BASE) {
    console.error("PY_API_BASE environment variable is not set");
    return NextResponse.json(
      { detail: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const r = await fetch(`${API_BASE}/auth/login`, {  // NOT /api/v1/auth/login
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

    // Set the cookie
    const res = NextResponse.json({ ok: true, access_token: token });

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
    
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { detail: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}