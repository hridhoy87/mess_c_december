"use client";

import * as React from "react";
import { Dialog } from "@/shared/ui/dialog";
import styles from "./PaymentDialog.module.css";
import { PaymentMethod } from "../types/billing.types";

const methods: PaymentMethod[] = ["CASH", "CARD", "BANK", "MOBILE"];

export function PaymentDialog({
  open,
  onOpenChange,
  onPay,
  maxSuggested,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onPay: (p: { method: PaymentMethod; amount: number }) => void;
  maxSuggested: number;
}) {
  const [method, setMethod] = React.useState<PaymentMethod>("CASH");
  const [amount, setAmount] = React.useState<number>(maxSuggested);

  React.useEffect(() => {
    if (open) setAmount(maxSuggested);
  }, [open, maxSuggested]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Take Payment"
      description="Record a payment against this folio."
      size="sm"
      footer={
        <div className={styles.footer}>
          <button className={styles.btnGhost} onClick={() => onOpenChange(false)}>Cancel</button>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              if (amount <= 0) return;
              onPay({ method, amount });
              onOpenChange(false);
            }}
          >
            Confirm Payment
          </button>
        </div>
      }
    >
      <div className={styles.body}>
        <label className={styles.label}>Method</label>
        <select className={styles.select} value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
          {methods.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <label className={styles.label}>Amount (BDT)</label>
        <input className={styles.input} type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <div className={styles.hint}>Suggested: {maxSuggested <= 0 ? "0" : maxSuggested}</div>
      </div>
    </Dialog>
  );
}
