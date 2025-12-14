"use client";

import { Room } from "../types/rooms.types";
import { Badge } from "@/shared/ui/primitives";
import styles from "./RoomCard.module.css";

function statusTone(status: Room["status"]) {
  switch (status) {
    case "AVAILABLE": return "emerald";
    case "OCCUPIED": return "royal";
    case "OUT_OF_ORDER":
    case "RENOVATION": return "burgundy";
    case "BOOKED": return "gold";
    default: return "neutral";
  }
}

export function RoomCard({ room, onClick }: { room: Room; onClick: (room: Room) => void }) {
  const acClass = room.ac === "AC" ? styles.ac : styles.nonAc;

  return (
    <button className={`${styles.card} ${acClass}`} onClick={() => onClick(room)}>
      <div className={styles.top}>
        <div className={styles.roomNo}>Room {room.number}</div>
        <Badge tone={statusTone(room.status) as any}>{room.status.replaceAll("_", " ")}</Badge>
      </div>

      <div className={styles.meta}>
        <div><span className={styles.k}>Type</span> {room.type}</div>
        <div><span className={styles.k}>Cap</span> {room.capacity}</div>
        <div><span className={styles.k}>Bed</span> {room.bed}</div>
        <div><span className={styles.k}>TV</span> {room.hasTV ? "Yes" : "No"}</div>
      </div>

      <div className={styles.bottom}>
        <Badge tone={room.ac === "AC" ? "royal" : "neutral"}>{room.ac}</Badge>
        <Badge tone={room.condition === "CLEAN" ? "emerald" : room.condition === "DIRTY" ? "gold" : "burgundy"}>
          {room.condition}
        </Badge>
        <div className={styles.next}>
          {room.nextBooking ? `Next: ${new Date(room.nextBooking).toLocaleString()}` : "No upcoming booking"}
        </div>
      </div>
    </button>
  );
}
