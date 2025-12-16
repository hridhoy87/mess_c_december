export const dynamic = "force-dynamic";

import * as React from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function Page() {
  return (
    <React.Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <ResetPasswordClient />
    </React.Suspense>
  );
}
