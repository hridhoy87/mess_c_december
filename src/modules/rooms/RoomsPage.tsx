"use client";

import * as React from "react";
import styles from "@/modules/rooms/styles/RoomsPage.module.css";
import { mockRooms, BUILDINGS } from "@/modules/rooms/services/rooms.mock";
import { Room } from "@/modules/rooms/types/rooms.types";
import { RoomCard } from "@/modules/rooms/components/RoomCard";
import { RoomQuickViewDialog } from "@/modules/rooms/components/RoomQuickViewDialog";
import { EditRoomDialog } from "@/modules/rooms/components/EditRoomDialog";

import { FolioDialog } from "@/modules/billing/components/FolioDialog";
import { mockFolioByRoomNumber } from "@/modules/billing/services/billing.mock";
import { Folio } from "@/modules/billing/types/billing.types";

import { CheckInDialog } from "@/modules/frontdesk/components/CheckinDialog";
import { CheckOutDialog } from "@/modules/frontdesk/components/CheckOutDialog";
import { Stay } from "@/modules/frontdesk/types/frontdesk.types";

import { Skeleton, useToast } from "@/shared/ui/primitives";

import { BuildingTabs } from "@/modules/rooms/components/BuildingTabs";

export default function RoomsPage() {
  const [loadingRooms, setLoadingRooms] = React.useState(false);
  const toast = useToast();

  const [building, setBuilding] = React.useState<(typeof BUILDINGS)[number]>("BLDG 72");
  const [selected, setSelected] = React.useState<Room | null>(null);

  const [allRooms, setAllRooms] = React.useState<Room[]>(() => mockRooms);
  const rooms = allRooms.filter((r) => r.building === building);

  const [editOpen, setEditOpen] = React.useState(false);

  const [folioOpen, setFolioOpen] = React.useState(false);
  const [folios, setFolios] = React.useState<Record<string, Folio>>(() => ({ ...mockFolioByRoomNumber }));
  const [activeFolioRoomNo, setActiveFolioRoomNo] = React.useState<string | null>(null);
  const activeFolio = activeFolioRoomNo ? folios[activeFolioRoomNo] ?? null : null;

  const [stays, setStays] = React.useState<Record<string, Stay>>({}); // keyed by roomId
  const [checkInOpen, setCheckInOpen] = React.useState(false);
  const [checkOutOpen, setCheckOutOpen] = React.useState(false);

  const activeStay = selected ? stays[selected.id] ?? null : null;

  const checkoutBalance = (() => {
    if (!selected) return 0;
    const f = folios[selected.number];
    if (!f) return 0;
    const total = f.charges.reduce((a, c) => a + c.amount, 0);
    const paid = f.payments.reduce((a, p) => a + p.amount, 0);
    return total - paid;
  })();

  const openFolioForRoom = (room: Room) => {
    setSelected(room);
    setActiveFolioRoomNo(room.number);
    setFolioOpen(true);
  };

  const setPayOpenFromCheckout = () => {
    if (!selected) return;
    setActiveFolioRoomNo(selected.number);
    setFolioOpen(true);
    // user clicks Take Payment inside Folio (simple and safe)
  };

  return (
  <main className={styles.page}>
    <h1 className={styles.title}>Rooms</h1>

    {/* <div className={styles.tabs}>
      {BUILDINGS.map((b) => (
        <button
          key={b}
          onClick={() => {
            if (b === building) return;
            setLoadingRooms(true);
            setBuilding(b);
            window.setTimeout(() => setLoadingRooms(false), 260);
          }}
          className={`${styles.tab} ${b === building ? styles.tabActive : ""}`}
        >
          {b}
        </button>
      ))}
    </div> */}

    <BuildingTabs
      value={building}
      items={BUILDINGS}
      onValueChange={(b) => {
        if (b === building) return;
        setLoadingRooms(true);
        setBuilding(b);
        window.setTimeout(() => setLoadingRooms(false), 260);
      }}
    />

    <div className={styles.grid}>
      {loadingRooms
        ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} style={{ height: 152 }} />)
        : rooms.map((room) => <RoomCard key={room.id} room={room} onClick={setSelected} />)}
    </div>
      <RoomQuickViewDialog
        room={selected}
        onClose={() => setSelected(null)}
        onEditRoom={(room) => {
          setSelected(room);
          setEditOpen(true);
        }}
        onCheckIn={(room) => {
          setSelected(room);
          setCheckInOpen(true);
        }}
        onCheckOut={(room) => {
          setSelected(room);
          setCheckOutOpen(true);
        }}
        onOpenFolio={(room) => openFolioForRoom(room)}
      />

      <FolioDialog
        open={folioOpen}
        onOpenChange={setFolioOpen}
        folio={activeFolio}
        onUpdateFolio={(next) => {
          setFolios((prev) => ({ ...prev, [next.roomNumber]: next }));
        }}
      />

      <EditRoomDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        room={selected}
        onSave={(next) => {
          setAllRooms((prev) => prev.map((r) => (r.id === next.id ? next : r)));
          setSelected(next);
          toast.push({
            tone: "success",
            title: "Room updated",
            message: `Room ${next.number} updated successfully.`,
          });
        }}
      />

      <CheckInDialog
        open={checkInOpen}
        onOpenChange={setCheckInOpen}
        room={selected}
        onCheckIn={(stay) => {
          // create stay
          setStays((prev) => ({ ...prev, [stay.roomId]: stay }));

          // update room status/condition
          setAllRooms((prev) =>
            prev.map((r) => (r.id === stay.roomId ? { ...r, status: "OCCUPIED", condition: "CLEAN" } : r))
          );

          // ensure folio exists for that room + attach guest name
          setFolios((prev) => {
            const existing = prev[stay.roomNumber];
            if (existing) {
              return {
                ...prev,
                [stay.roomNumber]: {
                  ...existing,
                  guestName: existing.guestName ?? stay.guestName,
                },
              };
            }
            return {
              ...prev,
              [stay.roomNumber]: {
                id: `f-${stay.roomNumber}`,
                roomId: stay.roomId,
                roomNumber: stay.roomNumber,
                guestName: stay.guestName,
                charges: [],
                payments: [],
              },
            };
          });

          // ✅ toast at correct time
          toast.push({
            tone: "success",
            title: "Checked in successfully",
            message: `Room ${stay.roomNumber} is now occupied.`,
          });
        }}
      />

      <CheckOutDialog
        open={checkOutOpen}
        onOpenChange={setCheckOutOpen}
        room={selected}
        stay={activeStay}
        balance={checkoutBalance}
        onTakePayment={() => setPayOpenFromCheckout()}
        onCheckOut={() => {
          if (!selected) return;

          const roomId = selected.id;
          const roomNumber = selected.number;

          // close stay
          setStays((prev) => {
            const next = { ...prev };
            delete next[roomId];
            return next;
          });

          // update room state: available + dirty
          setAllRooms((prev) =>
            prev.map((r) => (r.id === roomId ? { ...r, status: "AVAILABLE", condition: "DIRTY" } : r))
          );

          toast.push({
            tone: "success",
            title: "Checked out successfully",
            message: `Room ${roomNumber} is now available (dirty).`,
          });
        }}
      />
    </main>
  );
}
