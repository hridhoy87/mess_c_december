"use client";

import * as React from "react";
import { Dialog } from "@/shared/ui/dialog";

export default function Home() {
  const [open, setOpen] = React.useState(false);

  return (
    <main style={{ padding: 24 }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "var(--surface-3)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          padding: "10px 14px",
          borderRadius: "12px",
          cursor: "pointer",
        }}
      >
        Open Modal
      </button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Folio (Preview)"
        description="Centered modal, dark aristocratic palette, subtle motion."
        size="md"
      >
        This is your standardized modal wrapper. Everything (Check-in, Folio, Check-out)
        will reuse this.
      </Dialog>
    </main>
  );
}
