"use client";

import { ToastProvider } from "@/shared/ui/primitives/Toast";
import { AppShell } from "@/shared/ui/AppShell/AppShell";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AppShell>{children}</AppShell>
    </ToastProvider>
  );
}
