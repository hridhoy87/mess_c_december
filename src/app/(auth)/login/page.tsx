"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import styles from "../Auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await r.json().catch(() => null);

      if (!r.ok) {
        setError(data?.detail ?? "Login failed");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>Sign in</div>
        <div className={styles.subtitle}>Access the hotel operations console</div>

        <form onSubmit={onSubmit} className={styles.form}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />

          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? <div className={styles.error}>{error}</div> : null}

          <button className={styles.primaryBtn} disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>

          <button
            type="button"
            className={styles.linkBtn}
            onClick={() => router.push("/forgot-password")}
          >
            Forgot password?
          </button>
        </form>

        <div className={styles.hint}>
          Dev accounts: <code>admin@hotel.local / admin123</code> ·{" "}
          <code>frontdesk@hotel.local / frontdesk123</code>
        </div>
      </div>
    </div>
  );
}
