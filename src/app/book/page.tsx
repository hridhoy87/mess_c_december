export const dynamic = "force-dynamic";

import * as React from "react";
import BookClient from "./BookClient";

export default function Page() {
  return (
    <React.Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <BookClient />
    </React.Suspense>
  );
}
