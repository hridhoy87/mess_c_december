"use client";

import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import styles from "./SideDrawer.module.css";

export function SideDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      onOpenChange(false);
      router.replace("/login");
      router.refresh();
      setLoggingOut(false);
    }
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <RadixDialog.Portal forceMount>
            {/* Overlay */}
            <RadixDialog.Overlay asChild>
              <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </RadixDialog.Overlay>

            {/* Drawer */}
            <RadixDialog.Content asChild>
              <div className={styles.wrap}>
                <motion.aside
                  className={styles.drawer}
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -24, opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <VisuallyHidden>
                    <RadixDialog.Title>Application menu</RadixDialog.Title>
                    <RadixDialog.Description>
                      Navigation and front desk actions
                    </RadixDialog.Description>
                  </VisuallyHidden>

                  <div className={styles.head}>
                    <div>
                      <div className={styles.title}>STA OFFRS’ MESS C</div>
                      <div className={styles.sub}>Front Desk Shortcuts</div>
                    </div>

                    <RadixDialog.Close
                      className={styles.close}
                      aria-label="Close menu"
                    >
                      ✕
                    </RadixDialog.Close>
                  </div>

                  {/* Scrollable body */}
                  <div className={styles.body}>
                    <div className={styles.section}>
                      <div className={styles.sectionTitle}>Actions</div>
                      <Link
                        className={styles.action}
                        href="/rooms"
                        onClick={() => onOpenChange(false)}
                      >
                        CHECK IN
                      </Link>
                      <Link
                        className={styles.action}
                        href="/rooms"
                        onClick={() => onOpenChange(false)}
                      >
                        MANUAL BILL GENERATION
                      </Link>
                      <Link
                        className={styles.action}
                        href="/rooms"
                        onClick={() => onOpenChange(false)}
                      >
                        CHECK OUT
                      </Link>
                    </div>

                    <div className={styles.section}>
                      <div className={styles.sectionTitle}>Navigation</div>
                      <Link
                        className={styles.link}
                        href="/dashboard"
                        onClick={() => onOpenChange(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        className={styles.link}
                        href="/book"
                        onClick={() => onOpenChange(false)}
                      >
                        Book
                      </Link>
                      <Link
                        className={styles.link}
                        href="/rooms"
                        onClick={() => onOpenChange(false)}
                      >
                        Rooms
                      </Link>
                      <Link
                        className={styles.link}
                        href="/report"
                        onClick={() => onOpenChange(false)}
                      >
                        Report
                      </Link>
                    </div>
                  </div>

                  {/* Footer (always visible) */}
                  <div className={styles.footer}>
                    <div className={styles.footerTop}>
                      <div>
                        <div className={styles.userLine}>SGT XYZ</div>
                        <div className={styles.userRole}>FRONT DESK NCO</div>
                      </div>

                      <button
                        type="button"
                        className={styles.logout}
                        onClick={handleLogout}
                        disabled={loggingOut}
                      >
                        {loggingOut ? "Logging out…" : "Logout"}
                      </button>
                    </div>
                  </div>
                </motion.aside>
              </div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
}
