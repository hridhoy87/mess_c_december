"use client";

import * as React from "react";
import styles from "./AppShell.module.css";
import { AppHeader } from "./AppHeader";
import { SideDrawer } from "./SideDrawer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className={styles.shell}>
      <AppHeader onOpenDrawer={() => setDrawerOpen(true)} />
      <SideDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
