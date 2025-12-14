"use client";

import * as React from "react";
import { Dialog } from "@/shared/ui/dialog";
import styles from "./CheckInDialog.module.css";
import { Room } from "@/modules/rooms/types/rooms.types";
import { Stay } from "../types/frontdesk.types";

export function CheckInDialog({
  open,
  onOpenChange,
  room,
  onCheckIn,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  room: Room | null;
  onCheckIn: (stay: Stay) => void;
}) {
  const [guestName, setGuestName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [expectedOut, setExpectedOut] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setGuestName("");
      setPhone("");
      setExpectedOut("");
    }
  }, [open]);

  const canSubmit = !!room && guestName.trim().length >= 2;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={room ? `Check In — Room ${room.number}` : "Check In"}
      description={room ? `${room.building} • ${room.type} • ${room.ac}` : "Select a room"}
      size="sm"
      footer={
        <div className={styles.footer}>
          <button className={styles.btnGhost} onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button
            className={styles.btnPrimary}
            disabled={!canSubmit}
            onClick={() => {
              if (!room) return;
              const stay: Stay = {
                id: crypto.randomUUID(),
                roomId: room.id,
                roomNumber: room.number,
                guestName: guestName.trim(),
                phone: phone.trim() || undefined,
                checkInAt: new Date().toISOString(),
                expectedOutAt: expectedOut ? new Date(expectedOut).toISOString() : undefined,
                status: "CHECKED_IN",
              };
              onCheckIn(stay);
              onOpenChange(false);
            }}
          >
            Confirm Check-in
          </button>
        </div>
      }
    >
      <div className={styles.body}>
        <label className={styles.label}>Guest Name</label>
        <input className={styles.input} value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="e.g., Mr. Rahman" />

        <label className={styles.label}>Phone (optional)</label>
        <input className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., 01XXXXXXXXX" />

        <label className={styles.label}>Expected Check-out (optional)</label>
        <input className={styles.input} type="date" value={expectedOut} onChange={(e) => setExpectedOut(e.target.value)} />
      </div>
    </Dialog>
  );
}
