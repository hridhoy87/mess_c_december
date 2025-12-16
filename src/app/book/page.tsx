"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./BookPage.module.css";

function toISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function BookPage() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const fromQ = sp.get("from") ?? "";
  const toQ = sp.get("to") ?? "";

  const today = React.useMemo(() => new Date(), []);
  const defaultFrom = React.useMemo(() => toISODate(today), [today]);
  const defaultTo = React.useMemo(() => toISODate(addDays(today, 1)), [today]);

  const [from, setFrom] = React.useState(fromQ || defaultFrom);
  const [to, setTo] = React.useState(toQ || defaultTo);
  const [touched, setTouched] = React.useState(false);

  // Keep local state in sync if user navigates with back/forward
  React.useEffect(() => {
    setFrom(fromQ || defaultFrom);
    setTo(toQ || defaultTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromQ, toQ]);

  const isValidRange = React.useMemo(() => {
    if (!from || !to) return false;
    return new Date(to).getTime() > new Date(from).getTime();
  }, [from, to]);

  const showResults = Boolean(fromQ && toQ && isValidRange);

  function onSearch() {
    setTouched(true);
    if (!isValidRange) return;

    const next = new URLSearchParams(sp.toString());
    next.set("from", from);
    next.set("to", to);

    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Book</h1>
        <p className={styles.subtitle}>Search availability by date range</p>
      </div>

      <section className={styles.searchArea}>
        <div className={styles.pickersGrid}>
          <div className={styles.pickerCard}>
            <div className={styles.pickerLabel}>FROM</div>
            <div className={styles.pickerInner}>
              <label className={styles.visuallyHidden} htmlFor="fromDate">
                From date
              </label>
              <input
                id="fromDate"
                type="date"
                className={styles.dateInput}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onBlur={() => setTouched(true)}
              />
              <div className={styles.pickerHint}>DATE PICKER</div>
            </div>
          </div>

          <div className={styles.pickerCard}>
            <div className={styles.pickerLabel}>TO</div>
            <div className={styles.pickerInner}>
              <label className={styles.visuallyHidden} htmlFor="toDate">
                To date
              </label>
              <input
                id="toDate"
                type="date"
                className={styles.dateInput}
                value={to}
                min={from || undefined}
                onChange={(e) => setTo(e.target.value)}
                onBlur={() => setTouched(true)}
              />
              <div className={styles.pickerHint}>DATE PICKER</div>
            </div>
          </div>
        </div>

        <div className={styles.searchCtaRow}>
          <button
            type="button"
            className={styles.searchBtn}
            onClick={onSearch}
            aria-disabled={!isValidRange}
            data-invalid={touched && !isValidRange ? "1" : "0"}
          >
            SEARCH
          </button>

          {touched && !isValidRange ? (
            <div className={styles.validation}>
              “TO” must be after “FROM”.
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.resultsArea}>
        <AnimatePresence mode="wait">
          {showResults ? (
            <motion.div
              key="results"
              className={styles.resultsPanel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
            >
              <div className={styles.resultsTop}>
                <div className={styles.resultsTitle}>Availability Results</div>
                <div className={styles.resultsMeta}>
                  {fromQ} → {toQ}
                </div>
              </div>

              <div className={styles.resultsBody}>
                <div className={styles.resultsPlaceholder}>
                  RESULT AREA TO BE SHOWN IF THERE IS ANY RESULT
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className={styles.resultsPanel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
            >
              <div className={styles.resultsBody}>
                <div className={styles.resultsPlaceholder}>
                  Pick a date range and hit <b>SEARCH</b> to see availability.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
