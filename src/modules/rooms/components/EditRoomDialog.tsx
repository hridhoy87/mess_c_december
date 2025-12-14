"use client";

import * as React from "react";
import { Dialog } from "@/shared/ui/dialog";
import { Room, RoomCondition, RoomStatus } from "../types/rooms.types";
import styles from "./EditRoomDialog.module.css";

const statuses: RoomStatus[] = ["AVAILABLE", "BOOKED", "OCCUPIED", "OUT_OF_ORDER", "RENOVATION"];
const conditions: RoomCondition[] = ["CLEAN", "DIRTY", "MAINTENANCE"];

export function EditRoomDialog({
  open,
  onOpenChange,
  room,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  room: Room | null;
  onSave: (next: Room) => void;
}) {
  const [status, setStatus] = React.useState<RoomStatus>("AVAILABLE");
  const [condition, setCondition] = React.useState<RoomCondition>("CLEAN");
  const [ac, setAc] = React.useState<Room["ac"]>("AC");
  const [hasTV, setHasTV] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!room) return;
    setStatus(room.status);
    setCondition(room.condition);
    setAc(room.ac);
    setHasTV(room.hasTV);
  }, [room, open]);

  const canSave = !!room;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={room ? `Edit Room ${room.number}` : "Edit Room"}
      description="Update status, condition, and amenities. Changes reflect instantly on the board."
      size="sm"
      footer={
        <div className={styles.footer}>
          <button className={styles.btnGhost} onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button
            className={styles.btnPrimary}
            disabled={!canSave}
            onClick={() => {
              if (!room) return;
              onSave({
                ...room,
                status,
                condition,
                ac,
                hasTV,
              });
              onOpenChange(false);
            }}
          >
            Save Changes
          </button>
        </div>
      }
    >
      <div className={styles.body}>
        <div className={styles.row}>
          <label className={styles.label}>Status</label>
          <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as RoomStatus)}>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Condition</label>
          <select className={styles.select} value={condition} onChange={(e) => setCondition(e.target.value as RoomCondition)}>
            {conditions.map((c) => (
              <option key={c} value={c}>
                {c.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>AC</label>
          <select className={styles.select} value={ac} onChange={(e) => setAc(e.target.value as Room["ac"])}>
            <option value="AC">AC</option>
            <option value="NON_AC">NON AC</option>
          </select>
        </div>

        <div className={styles.rowInline}>
          <label className={styles.label}>TV</label>
          <input
            type="checkbox"
            checked={hasTV}
            onChange={(e) => setHasTV(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.muted}>Has TV</span>
        </div>
      </div>
    </Dialog>
  );
}
