"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../Auth.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = sp.get("token") || "";

  const [pw, setPw] = React.useState("");
  const [pw2, setPw2] = React.useState("");
  const [msg, setMsg] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!token) return setMsg("Missing reset token.");
    if (pw.length < 6) return setMsg("Password must be at least 6 characters.");
    if (pw !== pw2) return setMsg("Passwords do not match.");

    setLoading(true);
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: pw }),
    });

    if (!res.ok) {
      setMsg("Reset failed. Please request a new link.");
      setLoading(false);
      return;
    }

    setMsg("Password updated. Redirecting to login…");
    setTimeout(() => router.replace("/login"), 800);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>Reset password</div>
        <div className={styles.subtitle}>Set a new password for your account</div>

        <form onSubmit={onSubmit} className={styles.form}>
          <label className={styles.label}>New password</label>
          <input className={styles.input} type="password" value={pw} onChange={(e) => setPw(e.target.value)} />

          <label className={styles.label}>Confirm password</label>
          <input className={styles.input} type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} />

          {msg ? <div className={styles.info}>{msg}</div> : null}

          <button className={styles.primaryBtn} disabled={loading}>
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
