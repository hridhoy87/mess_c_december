"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import styles from "@/modules/rooms/styles/RoomsPage.module.css";

import { Room, RoomCondition } from "@/modules/rooms/types/rooms.types";
import { RoomCard } from "@/modules/rooms/components/RoomCard";
import { RoomQuickViewDialog } from "@/modules/rooms/components/RoomQuickViewDialog";
import { EditRoomDialog } from "@/modules/rooms/components/EditRoomDialog";

import { FolioDialog } from "@/modules/billing/components/FolioDialog";
import { Folio } from "@/modules/billing/types/billing.types";

import { CheckInDialog } from "@/modules/frontdesk/components/CheckinDialog";
import { CheckOutDialog } from "@/modules/frontdesk/components/CheckOutDialog";
import { Stay } from "@/modules/frontdesk/types/frontdesk.types";

import { Skeleton, useToast } from "@/shared/ui/primitives";
import { BuildingTabs } from "@/modules/rooms/components/BuildingTabs";

/** ---------- Types & Helpers ---------- */

// Use relative path for BFF pattern. The browser talks to Next.js (port 3000)
const API_BASE = "/api/v1";

type BuildingApi = {
  id: string;
  code: string;
  name: string;
  is_active?: boolean;
};

type RoomApi = {
  id: string;
  building_id: string;
  room_type_id: string;
  room_number: string;
  floor?: number | null;
  status?: string | null;
  is_active?: boolean;
  capacity?: number;
  beds?: string;
  has_tv?: boolean;
  has_ac?: boolean;
  other_amenity?: string | null;
  next_booking?: string | null;
};

/**
 * Generic API fetcher that routes through the Next.js BFF.
 * Handles 401 redirects automatically.
 */
async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // No explicit credentials needed here; the browser sends the 
    // same-origin 'messc_session' cookie automatically to /api/...
  });

  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status}`);
  }

  return res.json();
}

/** Map backend room to frontend Room shape */
function toFrontRoom(r: RoomApi, buildingCode: string, buildingId: string): Room {
  const statusMap: Record<string, string> = {
    available: "AVAILABLE",
    occupied: "OCCUPIED",
    cleaning: "CLEANING",
    maintenance: "MAINTENANCE",
  };

  const conditionMap: Record<string, RoomCondition> = {
    cleaning: "CLEAN",
    maintenance: "MAINTENANCE",
    occupied: "DIRTY",
    available: "CLEAN",
  };

  const backendStatus = r.status?.toLowerCase() || "available";
  const frontendStatus = statusMap[backendStatus] || "AVAILABLE";
  const frontendCondition = conditionMap[backendStatus] || "CLEAN";

  return {
    id: r.id,
    building_id: buildingId,
    room_type_id: r.room_type_id,
    room_number: r.room_number,
    floor: r.floor || undefined,
    status: frontendStatus,
    is_active: r.is_active ?? true,
    capacity: r.capacity || 2,
    beds: r.beds || "01xSemi Double",
    has_tv: r.has_tv ?? false,
    has_ac: r.has_ac ?? false,
    other_amenity: r.other_amenity || undefined,
    next_booking: r.next_booking || undefined,

    // UI-only fields
    building: buildingCode,
    number: r.room_number,
    hasTV: r.has_tv ?? false,
    ac: r.has_ac ? "AC" : "NON_AC",
    condition: frontendCondition,
    type: "Standard",
    bed: (r.beds || "01xSemi Double").split("x")[1]?.trim() || "Semi Double",
    nextBooking: r.next_booking || undefined,
  };
}

function formatNextBooking(dateStr: string | null | undefined): string {
  if (!dateStr) return "No upcoming booking";
  try {
    return `Next: ${new Date(dateStr).toLocaleString()}`;
  } catch {
    return "Invalid date";
  }
}

export default function RoomsPage() {
  const toast = useToast();
  const router = useRouter();

  const [loadingRooms, setLoadingRooms] = React.useState(false);
  const [loadingBuildings, setLoadingBuildings] = React.useState(true);

  const [buildings, setBuildings] = React.useState<BuildingApi[]>([]);
  const buildingCodes = React.useMemo(() => buildings.map((b) => b.code), [buildings]);

  const [building, setBuilding] = React.useState<string>("");
  const [selected, setSelected] = React.useState<Room | null>(null);
  const [allRooms, setAllRooms] = React.useState<Room[]>([]);
  
  // Dialog States
  const [editOpen, setEditOpen] = React.useState(false);
  const [folioOpen, setFolioOpen] = React.useState(false);
  const [folios, setFolios] = React.useState<Record<string, Folio>>({});
  const [activeFolioRoomNo, setActiveFolioRoomNo] = React.useState<string | null>(null);
  const [checkInOpen, setCheckInOpen] = React.useState(false);
  const [checkOutOpen, setCheckOutOpen] = React.useState(false);
  const [stays, setStays] = React.useState<Record<string, Stay>>({});

  // Filter rooms for current building
  const rooms = React.useMemo(
    () => allRooms.filter((r) => r.building === building),
    [allRooms, building]
  );

  const activeFolio = activeFolioRoomNo ? folios[activeFolioRoomNo] ?? null : null;
  const activeStay = selected ? stays[selected.id] ?? null : null;

  const checkoutBalance = React.useMemo(() => {
    if (!selected) return 0;
    const f = folios[selected.number];
    if (!f) return 0;
    const total = f.charges.reduce((acc, charge) => acc + charge.amount, 0);
    const paid = f.payments.reduce((acc, payment) => acc + payment.amount, 0);
    return total - paid;
  }, [folios, selected]);

  /** ---------- Load Buildings ---------- */
  React.useEffect(() => {
    let isMounted = true;

    async function loadBuildings() {
      try {
        setLoadingBuildings(true);
        // Calls /api/buildings (BFF)
        const data = await apiGet<BuildingApi[]>("/buildings");

        if (!isMounted) return;

        const active = data.filter((b) => b.is_active !== false);
        setBuildings(active);

        // Auto-select first building
        if (active.length > 0) {
          setBuilding(active[0].code);
        }
      } catch (e: any) {
        if (!isMounted) return;
        toast.push({
          tone: "warning",
          title: "Failed to load buildings",
          message: e?.message ?? "Check your connection.",
        });
      } finally {
        if (isMounted) setLoadingBuildings(false);
      }
    }

    loadBuildings();
    return () => { isMounted = false; };
  }, [toast]);

  /** ---------- Load Rooms ---------- */
  React.useEffect(() => {
    if (!building) return;
    
    const currentBuilding = buildings.find((x) => x.code === building);
    if (!currentBuilding) {
      setAllRooms([]);
      return;
    }

    let isMounted = true;

    async function loadRoomsForBuilding() {
      try {
        setLoadingRooms(true);
        // Calls /api/rooms (BFF)
        const data = await apiGet<RoomApi[]>(
          `/rooms?building_id=${encodeURIComponent(currentBuilding.id)}&active=true`
        );

        if (!isMounted) return;

        const mappedRooms = data
          .filter((r) => r.is_active !== false)
          .map((r) => toFrontRoom(r, currentBuilding.code, currentBuilding.id));

        setAllRooms(mappedRooms);
      } catch (e: any) {
        if (!isMounted) return;
        toast.push({
          tone: "warning",
          title: "Failed to load rooms",
          message: e?.message ?? "Check your connection.",
        });
        setAllRooms([]);
      } finally {
        if (isMounted) setLoadingRooms(false);
      }
    }

    loadRoomsForBuilding();
    return () => { isMounted = false; };
  }, [building, buildings, toast]);

  /** ---------- Handlers ---------- */
  const openFolioForRoom = (room: Room) => {
    setSelected(room);
    setActiveFolioRoomNo(room.number);
    setFolioOpen(true);
  };

  const setPayOpenFromCheckout = () => {
    if (!selected) return;
    setActiveFolioRoomNo(selected.number);
    setFolioOpen(true);
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Rooms</h1>

      <BuildingTabs
        value={building}
        items={buildingCodes.length ? buildingCodes : ["Loading…"]}
        onValueChange={(newBuilding) => {
          if (newBuilding === building) return;
          setSelected(null);
          setBuilding(newBuilding);
        }}
      />

      <div className={styles.grid}>
        {loadingBuildings || loadingRooms ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} style={{ height: 152 }} />
          ))
        ) : rooms.length ? (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={setSelected}
              nextBookingText={formatNextBooking(room.next_booking || room.nextBooking)}
            />
          ))
        ) : building ? (
          <div className={styles.emptyState}>
            No rooms found for <strong>{building}</strong>.
          </div>
        ) : (
          <div className={styles.emptyState}>
            Select a building to view rooms.
          </div>
        )}
      </div>

      <RoomQuickViewDialog
        room={selected}
        onClose={() => setSelected(null)}
        onEditRoom={() => setEditOpen(true)}
        onCheckIn={() => setCheckInOpen(true)}
        onCheckOut={() => setCheckOutOpen(true)}
        onOpenFolio={() => openFolioForRoom(selected!)}
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
        onSave={(updatedRoom) => {
          setAllRooms((prev) =>
            prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
          );
          setSelected(updatedRoom);
          toast.push({
            tone: "success",
            title: "Room updated",
            message: `Room ${updatedRoom.number} updated successfully.`,
          });
        }}
      />

      <CheckInDialog
        open={checkInOpen}
        onOpenChange={setCheckInOpen}
        room={selected}
        onCheckIn={(stay) => {
          setStays((prev) => ({ ...prev, [stay.roomId]: stay }));
          setAllRooms((prev) =>
            prev.map((r) =>
              r.id === stay.roomId
                ? { ...r, status: "OCCUPIED", condition: "CLEAN" }
                : r
            )
          );
          
          // Initialize folio for new guest
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

          toast.push({
            tone: "success",
            title: "Checked in",
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
        onTakePayment={setPayOpenFromCheckout}
        onCheckOut={() => {
          if (!selected) return;
          const roomId = selected.id;

          setStays((prev) => {
            const next = { ...prev };
            delete next[roomId];
            return next;
          });

          setAllRooms((prev) =>
            prev.map((r) =>
              r.id === roomId
                ? { ...r, status: "AVAILABLE", condition: "DIRTY" }
                : r
            )
          );

          toast.push({
            tone: "success",
            title: "Checked out",
            message: `Room ${selected.number} is now available (dirty).`,
          });
        }}
      />
    </main>
  );
}