"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import styles from "../Auth.module.css";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [devLink, setDevLink] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    setDone(true);
    if (data.dev_reset_link) setDevLink(data.dev_reset_link);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>Forgot password</div>
        <div className={styles.subtitle}>We’ll send a reset link to your email</div>

        <form onSubmit={onSubmit} className={styles.form}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />

          <button className={styles.primaryBtn}>{done ? "Sent" : "Send reset link"}</button>

          <button type="button" className={styles.linkBtn} onClick={() => router.push("/login")}>
            Back to login
          </button>
        </form>

        {devLink ? (
          <div className={styles.hint}>
            Dev reset link: <code>{devLink}</code>
          </div>
        ) : null}
      </div>
    </div>
  );
}
