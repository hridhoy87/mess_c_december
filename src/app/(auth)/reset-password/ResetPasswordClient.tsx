"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../Auth.module.css";

export default function ResetPasswordClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";

  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: wire to your backend later
      // await fetch("/api/auth/reset-password", ...)

      router.replace("/login");
    } catch {
      setError("Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>Reset password</div>

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.hint}>
            Token: <code>{token ? token.slice(0, 12) + "…" : "(missing)"}</code>
          </div>

          <label className={styles.label}>New password</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? <div className={styles.error}>{error}</div> : null}

          <button className={styles.primaryBtn} disabled={loading}>
            {loading ? "Resetting…" : "Reset"}
          </button>
        </form>
      </div>
    </div>
  );
}
