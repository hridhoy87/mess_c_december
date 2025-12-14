"use client";

import * as React from "react";
import { Dialog } from "@/shared/ui/dialog";
import styles from "./FolioDialog.module.css";
import { Folio, ChargeCategory } from "../types/billing.types";
import { LedgerTable } from "./LedgerTable";
import { AddChargePanel } from "./AddChargePanel";
import { PaymentDialog } from "./PaymentDialog";

function fmt(n: number) {
  return new Intl.NumberFormat("en-BD").format(n);
}

function sumCharges(f: Folio) {
  return f.charges.reduce((a, c) => a + c.amount, 0);
}
function sumPayments(f: Folio) {
  return f.payments.reduce((a, p) => a + p.amount, 0);
}

export function FolioDialog({
  open,
  onOpenChange,
  folio,
  onUpdateFolio,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  folio: Folio | null;
  onUpdateFolio: (next: Folio) => void;
}) {
  const [payOpen, setPayOpen] = React.useState(false);

  if (!folio) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} title="Folio" description="No folio selected." size="lg">
        Select an occupied room to view folio.
      </Dialog>
    );
  }

  const total = sumCharges(folio);
  const paid = sumPayments(folio);
  const balance = total - paid;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        title={`Folio — Room ${folio.roomNumber}`}
        description={folio.guestName ? `Guest: ${folio.guestName}` : "Guest: —"}
        size="lg"
        footer={
          <div className={styles.footer}>
            <div className={styles.totals}>
              <div className={styles.totalBox}>
                <div className={styles.label}>Total</div>
                <div className={styles.value}>৳ {fmt(total)}</div>
              </div>
              <div className={styles.totalBox}>
                <div className={styles.label}>Paid</div>
                <div className={styles.valuePaid}>৳ {fmt(paid)}</div>
              </div>
              <div className={styles.totalBox}>
                <div className={styles.label}>Balance</div>
                <div className={styles.valueGold}>৳ {fmt(balance)}</div>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={() => setPayOpen(true)} disabled={balance <= 0}>
                Take Payment
              </button>
              <button className={styles.btnGold} onClick={() => alert("Print (later)")}>
                Print
              </button>
            </div>
          </div>
        }
      >
        <div className={styles.grid}>
          <LedgerTable charges={folio.charges} payments={folio.payments} />
          <AddChargePanel
            onAdd={(c) => {
              const next = {
                ...folio,
                charges: [
                  ...folio.charges,
                  {
                    id: crypto.randomUUID(),
                    at: new Date().toISOString(),
                    category: c.category as ChargeCategory,
                    description: c.description,
                    amount: c.amount,
                  },
                ],
              };
              onUpdateFolio(next);
            }}
          />
        </div>
      </Dialog>

      <PaymentDialog
        open={payOpen}
        onOpenChange={setPayOpen}
        maxSuggested={balance > 0 ? balance : 0}
        onPay={(p) => {
          const next = {
            ...folio,
            payments: [
              ...folio.payments,
              { id: crypto.randomUUID(), at: new Date().toISOString(), method: p.method, amount: p.amount },
            ],
          };
          onUpdateFolio(next);
        }}
      />
    </>
  );
}
