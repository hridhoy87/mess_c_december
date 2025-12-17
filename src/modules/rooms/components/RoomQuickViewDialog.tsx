"use client";

import * as React from "react";
import { Dialog } from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/primitives";
import { Room } from "../types/rooms.types";
import styles from "./RoomQuickViewDialog.module.css";

type Props = {
  room: Room | null;
  onClose: () => void;

  onOpenFolio: (room: Room) => void;
  onEditRoom: (room: Room) => void;
  onCheckIn: (room: Room) => void;
  onCheckOut: (room: Room) => void;
};

function toneForStatus(status: Room["status"]) {
  switch (status) {
    case "AVAILABLE": return "emerald";
    case "OCCUPIED": return "royal";
    case "BOOKED": return "gold";
    case "RENOVATION":
    case "OUT_OF_ORDER": return "burgundy";
    default: return "neutral";
  }
}

export function RoomQuickViewDialog({
  room,
  onClose,
  onOpenFolio,
  onEditRoom,
  onCheckIn,
  onCheckOut,
}: Props) {
  const open = !!room;

  const footer = room ? (
    <div className={styles.footer}>
      <button className={styles.btnGhost} onClick={() => onEditRoom(room)}>
        Edit Room
      </button>

      <div className={styles.footerRight}>
        {room.status === "AVAILABLE" && (
          <button className={styles.btnPrimary} onClick={() => onCheckIn(room)}>
            Check In
          </button>
        )}

        {room.status === "OCCUPIED" && (
          <>
            <button className={styles.btnGold} onClick={() => onOpenFolio(room)}>
              Open Folio
            </button>
            <button className={styles.btnPrimary} onClick={() => onCheckOut(room)}>
              Check Out
            </button>
          </>
        )}

        {(room.status === "BOOKED" || room.status === "OUT_OF_ORDER" || room.status === "RENOVATION") && (
          <button className={styles.btnGold} onClick={() => onOpenFolio(room)}>
            Open Folio
          </button>
        )}
      </div>
    </div>
  ) : null;
  
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title={room ? `Room ${room.number} — ${room.building}` : undefined}
      description={room ? `${room.type} • ${room.ac} • ${room.status}` : undefined}
      size="md"
      footer={footer}
    >
      {room ? (
        <div className={styles.grid}>
          <div className={styles.panel}>
            <div className={styles.row}>
              <Badge tone={toneForStatus(room.status) as any}>{room.status.replaceAll("_", " ")}</Badge>
              <Badge tone={room.ac === "AC" ? "royal" : "neutral"}>{room.ac}</Badge>
              <Badge
                tone={room.condition === "CLEAN" ? "emerald" : room.condition === "DIRTY" ? "gold" : "burgundy"}
              >
                {room.condition}
              </Badge>
            </div>

            <div className={styles.kv}>
              <div><span className={styles.k}>Capacity</span> {room.capacity}</div>
              <div><span className={styles.k}>Bed</span> {room.bed}</div>
              <div><span className={styles.k}>TV</span> {room.hasTV ? "Yes" : "No"}</div>
              <div>
                <span className={styles.k}>Next Booking</span>{" "}
                {room.next_booking || room.nextBooking 
                  ? new Date((room.next_booking || room.nextBooking) as string).toLocaleString() 
                  : "None"}
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.subTitle}>Current Stay (mock)</div>

            {room.status === "OCCUPIED" ? (
              <div className={styles.kv}>
                <div><span className={styles.k}>Guest</span> Mr. X (placeholder)</div>
                <div><span className={styles.k}>Check-in</span> 14/12/2025</div>
                <div><span className={styles.k}>Expected out</span> 16/12/2025</div>

                <div className={styles.moneyRow}>
                  <div className={styles.moneyBox}>
                    <div className={styles.moneyLabel}>Total</div>
                    <div className={styles.moneyValue}>৳ 5,500</div>
                  </div>
                  <div className={styles.moneyBox}>
                    <div className={styles.moneyLabel}>Paid</div>
                    <div className={styles.moneyValueMuted}>৳ 2,000</div>
                  </div>
                  <div className={styles.moneyBox}>
                    <div className={styles.moneyLabel}>Balance</div>
                    <div className={styles.moneyValueGold}>৳ 3,500</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.empty}>
                No active stay. Use <span className={styles.em}>Check In</span> when room is available.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
