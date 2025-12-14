"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import styles from "./BuildingTabs.module.css";

export function BuildingTabs<T extends string>({
  value,
  onValueChange,
  items,
}: {
  value: T;
  onValueChange: (v: T) => void;
  items: readonly T[];
}) {
  return (
    <Tabs.Root value={value} onValueChange={(v) => onValueChange(v as T)} className={styles.root}>
      <Tabs.List className={styles.list} aria-label="Building selection">
        {items.map((b) => (
          <Tabs.Trigger key={b} value={b} className={styles.trigger}>
            {b}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
