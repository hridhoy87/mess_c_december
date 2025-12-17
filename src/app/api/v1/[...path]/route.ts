import { cookies } from "next/headers";

function backendUrl(pathname: string, search: string) {
  const base = process.env.PY_API_BASE; // e.g. http://localhost:8009/api/v1
  if (!base) throw new Error("PY_API_BASE not set");
  return `${base}${pathname}${search}`;
}

async function proxy(req: Request) {
  const url = new URL(req.url);

  // url.pathname is like: /api/v1/buildings or /api/v1/rooms
  // we want to forward only the part AFTER /api/v1
  const forwardPath = url.pathname.replace(/^\/api\/v1/, "");
  const target = backendUrl(forwardPath, url.search);

  const jar = await cookies();
  const token = jar.get("messc_session")?.value;

  const headers = new Headers(req.headers);

  // Make sure we don't forward browser cookies to backend (keep it clean)
  headers.delete("cookie");
  headers.delete("host");

  // Attach token to backend as Authorization (typical FastAPI/JWT pattern)
  if (token) headers.set("authorization", `Bearer ${token}`);

  const hasBody = !["GET", "HEAD"].includes(req.method);
  const r = await fetch(target, {
    method: req.method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    cache: "no-store",
  });

  // Return backend response to the browser
  const resHeaders = new Headers(r.headers);
  resHeaders.delete("set-cookie"); // backend shouldn't set cookies in BFF mode

  return new Response(await r.arrayBuffer(), {
    status: r.status,
    headers: resHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
