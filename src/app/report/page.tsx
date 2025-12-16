"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ReportPage.module.css";

const SYSTEM_PROMPT = `
You are a reporting engine for a hotel management system.

Rules:
- Respond ONLY with a valid Markdown table.
- Do NOT add explanations, summaries, or prose.
- If the request cannot be fulfilled as a table, respond with:
  FAIL: Cannot generate a table for this request.
`;

export default function ReportPage() {
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function generateReport() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/report-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.status === "fail") {
        setError(data.message);
      } else {
        setResult(data.table);
      }
    } catch {
      setError("System error. Unable to generate report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Reports</h1>
        <p className={styles.subtitle}>
          Generate operational reports using natural language
        </p>
      </div>

      {/* Prompt input */}
      <section className={styles.promptPanel}>
        <textarea
          className={styles.promptInput}
          placeholder="e.g. Show building-wise occupancy for last 7 days"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className={styles.actions}>
          <button
            className={styles.generateBtn}
            onClick={generateReport}
            disabled={loading}
          >
            {loading ? "Generating…" : "Generate Report"}
          </button>
        </div>
      </section>

      {/* Result */}
      <section className={styles.resultPanel}>
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              className={styles.errorBox}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
            >
              {error}
            </motion.div>
          ) : null}

          {result ? (
            <motion.div
              key="table"
              className={styles.tableWrapper}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
            >
              <MarkdownTable markdown={result} />
            </motion.div>
          ) : !loading ? (
            <motion.div
              key="empty"
              className={styles.placeholder}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
            >
              Generated tables will appear here
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </div>
  );
}

/* ---------- Table Renderer ---------- */

function MarkdownTable({ markdown }: { markdown: string }) {
  const lines = markdown.trim().split("\n");

  if (lines.length < 2 || !lines[0].includes("|")) {
    return <div className={styles.errorBox}>Invalid table format</div>;
  }

  const headers = lines[0].split("|").filter(Boolean);
  const rows = lines.slice(2).map((r) => r.split("|").filter(Boolean));

  return (
    <div className={styles.scrollContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h.trim()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell.trim()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
