"use client";

import { Dialog } from "@/shared/ui/dialog";
import styles from "./CheckOutDialog.module.css";
import { Room } from "@/modules/rooms/types/rooms.types";
import { Stay } from "../types/frontdesk.types";

export function CheckOutDialog({
  open,
  onOpenChange,
  room,
  stay,
  balance,
  onCheckOut,
  onTakePayment,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  room: Room | null;
  stay: Stay | null;
  balance: number;
  onCheckOut: () => void;
  onTakePayment: () => void;
}) {
  const canCheckout = balance <= 0;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={room ? `Check Out — Room ${room.number}` : "Check Out"}
      description={stay ? `Guest: ${stay.guestName}` : "No active stay"}
      size="sm"
      footer={
        <div className={styles.footer}>
          <button className={styles.btnGhost} onClick={() => onOpenChange(false)}>
            Close
          </button>

          <div className={styles.right}>
            {!canCheckout && (
              <button className={styles.btnGold} onClick={onTakePayment}>
                Take Payment
              </button>
            )}

            <button
              className={styles.btnPrimary}
              disabled={!canCheckout}
              onClick={() => {
                onCheckOut();
                onOpenChange(false);
              }}
            >
              Confirm Check-out
            </button>
          </div>
        </div>
      }
    >
      <div className={styles.body}>
        {stay ? (
          <>
            <div className={styles.row}>
              <span className={styles.k}>Check-in</span>
              <span className={styles.v}>{new Date(stay.checkInAt).toLocaleString()}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.k}>Balance Due</span>
              <span className={balance > 0 ? styles.gold : styles.ok}>
                ৳ {new Intl.NumberFormat("en-BD").format(balance)}
              </span>
            </div>

            {!canCheckout && (
              <div className={styles.warn}>
                Checkout is blocked until balance is cleared.
              </div>
            )}
          </>
        ) : (
          <div className={styles.warn}>No active stay found for this room.</div>
        )}
      </div>
    </Dialog>
  );
}
