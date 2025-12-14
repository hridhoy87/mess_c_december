"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Toast.module.css";

export type ToastTone = "neutral" | "success" | "warning";

export type ToastItem = {
  id: string;
  title: string;
  message?: string;
  tone?: ToastTone;
  ttlMs?: number;
};

type ToastContextValue = {
  push: (t: Omit<ToastItem, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const push = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    const item: ToastItem = {
      id,
      tone: t.tone ?? "neutral",
      ttlMs: t.ttlMs ?? 2200,
      title: t.title,
      message: t.message,
    };

    setItems((prev) => [item, ...prev].slice(0, 3)); // cap at 3 toasts

    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, item.ttlMs);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <ToastViewport items={items} onDismiss={(id) => setItems((p) => p.filter((x) => x.id !== id))} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className={styles.viewport} aria-live="polite" aria-relevant="additions">
      <AnimatePresence initial={false}>
        {items.map((t) => (
          <motion.div
            key={t.id}
            className={`${styles.toast} ${styles[t.tone ?? "neutral"]}`}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            <div className={styles.head}>
              <div className={styles.title}>{t.title}</div>
              <button className={styles.close} onClick={() => onDismiss(t.id)} aria-label="Dismiss">
                ✕
              </button>
            </div>
            {t.message && <div className={styles.msg}>{t.message}</div>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
