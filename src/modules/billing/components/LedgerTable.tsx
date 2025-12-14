"use client";

import styles from "./LedgerTable.module.css";
import { Charge, Payment } from "../types/billing.types";

function fmt(n: number) {
  return new Intl.NumberFormat("en-BD").format(n);
}

export function LedgerTable({ charges, payments }: { charges: Charge[]; payments: Payment[] }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.headerRow}>
        <div>Time</div>
        <div>Type</div>
        <div>Description</div>
        <div className={styles.amount}>Amount</div>
      </div>

      {charges.map((c) => (
        <div key={c.id} className={styles.row}>
          <div className={styles.time}>{new Date(c.at).toLocaleString()}</div>
          <div className={styles.kind}>{c.category.replaceAll("_", " ")}</div>
          <div className={styles.desc}>{c.description}</div>
          <div className={styles.amount}>৳ {fmt(c.amount)}</div>
        </div>
      ))}

      {payments.map((p) => (
        <div key={p.id} className={`${styles.row} ${styles.paymentRow}`}>
          <div className={styles.time}>{new Date(p.at).toLocaleString()}</div>
          <div className={styles.kind}>PAYMENT ({p.method})</div>
          <div className={styles.desc}>Payment received</div>
          <div className={`${styles.amount} ${styles.paymentAmt}`}>- ৳ {fmt(p.amount)}</div>
        </div>
      ))}
    </div>
  );
}
