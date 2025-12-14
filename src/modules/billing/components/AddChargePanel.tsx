"use client";

import * as React from "react";
import styles from "./AddChargePanel.module.css";
import { ChargeCategory } from "../types/billing.types";

const categories: ChargeCategory[] = ["ROOM_RENT", "DINING", "BAR", "EXTRA"];

export function AddChargePanel({
  onAdd,
}: {
  onAdd: (c: { category: ChargeCategory; description: string; amount: number }) => void;
}) {
  const [category, setCategory] = React.useState<ChargeCategory>("DINING");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState<number>(0);

  return (
    <div className={styles.panel}>
      <div className={styles.title}>Add Charge</div>

      <label className={styles.label}>Category</label>
      <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value as ChargeCategory)}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c.replaceAll("_", " ")}
          </option>
        ))}
      </select>

      <label className={styles.label}>Description</label>
      <input className={styles.input} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Dinner, Bar, Extra mattress" />

      <label className={styles.label}>Amount (BDT)</label>
      <input className={styles.input} type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />

      <button
        className={styles.btn}
        onClick={() => {
          if (!description.trim() || amount <= 0) return;
          onAdd({ category, description: description.trim(), amount });
          setDescription("");
          setAmount(0);
        }}
      >
        Add Line
      </button>
    </div>
  );
}
