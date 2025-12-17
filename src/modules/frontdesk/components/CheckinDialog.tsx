"use client";

import * as React from "react";
import { Dialog } from "@/shared/ui/dialog";
import styles from "./CheckInDialog.module.css";
import { Room } from "@/modules/rooms/types/rooms.types";
import { Stay } from "../types/frontdesk.types";

type GuestDraft = {
  ba_no?: string;
  rk?: string;
  full_name: string;

  unit?: string;
  dt_of_req?: string; // yyyy-mm-dd (Guest model uses date)

  id_card_no?: string;
  pers_mobile_no?: string;

  accompanying_num: number;
  spouse: boolean;
  children: boolean;

  car: boolean;
  car_num?: string;

  batman: boolean;
  names_accompanying?: string;

  purpose_of_use?: string;
  alot_room?: string;

  res_1?: string;
  res_2?: string;
  res_3?: string;
  res_4?: string;
};

type PhotoDraft = {
  id: string;
  file: File;
  previewUrl: string;
  note?: string;
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function emptyGuest(): GuestDraft {
  return {
    full_name: "",
    ba_no: "",
    rk: "",
    unit: "",
    dt_of_req: "",
    id_card_no: "",
    pers_mobile_no: "",
    accompanying_num: 0,
    spouse: false,
    children: false,
    car: false,
    car_num: "",
    batman: false,
    names_accompanying: "",
    purpose_of_use: "",
    alot_room: "",
    res_1: "",
    res_2: "",
    res_3: "",
    res_4: "",
  };
}

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
  const [guest, setGuest] = React.useState<GuestDraft>(emptyGuest());
  const [expectedOut, setExpectedOut] = React.useState(""); // stay expected out (optional)
  const [more, setMore] = React.useState(false);

  const [photos, setPhotos] = React.useState<PhotoDraft[]>([]);

  React.useEffect(() => {
    if (open) {
      setGuest(emptyGuest());
      setExpectedOut("");
      setMore(false);

      // cleanup previews
      setPhotos((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.previewUrl));
        return [];
      });
    }
  }, [open]);

  const canSubmit = !!room && guest.full_name.trim().length >= 2;

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const next: PhotoDraft[] = Array.from(files).map((f) => ({
      id: uid(),
      file: f,
      previewUrl: URL.createObjectURL(f),
      note: "",
    }));
    setPhotos((p) => [...p, ...next]);
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) URL.revokeObjectURL(found.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  function setPhotoNote(id: string, note: string) {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, note } : p)));
  }

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

              // Build payloads aligned to backend models:
              // - guestDraft -> Guest table fields
              // - photos -> GuestPhoto rows later (needs storage upload first)
              const guestDraft: GuestDraft = {
                ...guest,
                full_name: guest.full_name.trim(),
                accompanying_num: Number(guest.accompanying_num || 0),
                dt_of_req: guest.dt_of_req || "",
                pers_mobile_no: (guest.pers_mobile_no || "").trim(),
                id_card_no: (guest.id_card_no || "").trim(),
              };

              const stay: Stay = {
                id: crypto.randomUUID(),
                roomId: room.id,
                roomNumber: room.number,

                // keep your existing Stay fields populated from Guest model
                guestName: guestDraft.full_name,
                phone: guestDraft.pers_mobile_no || undefined,

                checkInAt: new Date().toISOString(),
                expectedOutAt: expectedOut ? new Date(expectedOut).toISOString() : undefined,
                status: "CHECKED_IN",

                // carry full model payloads forward without breaking types
                // (later: replace this with real API calls + returned ids)
                ...( {
                  meta: {
                    guestDraft,
                    photos: photos.map((p) => ({
                      name: p.file.name,
                      size: p.file.size,
                      type: p.file.type,
                      note: p.note || "",
                    })),
                  },
                } as any),
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
        {/* Guest model core fields */}
        <label className={styles.label}>Full name *</label>
        <input
          className={styles.input}
          value={guest.full_name}
          onChange={(e) => setGuest((g) => ({ ...g, full_name: e.target.value }))}
          placeholder="e.g., Mr. Rahman"
        />

        <label className={styles.label}>BA No (optional)</label>
        <input
          className={styles.input}
          value={guest.ba_no || ""}
          onChange={(e) => setGuest((g) => ({ ...g, ba_no: e.target.value }))}
          placeholder="Optional"
        />

        <label className={styles.label}>RK (optional)</label>
        <input
          className={styles.input}
          value={guest.rk || ""}
          onChange={(e) => setGuest((g) => ({ ...g, rk: e.target.value }))}
          placeholder="Optional"
        />

        <label className={styles.label}>Unit (optional)</label>
        <input
          className={styles.input}
          value={guest.unit || ""}
          onChange={(e) => setGuest((g) => ({ ...g, unit: e.target.value }))}
          placeholder="Optional"
        />

        <label className={styles.label}>Date of request (optional)</label>
        <input
          className={styles.input}
          type="date"
          value={guest.dt_of_req || ""}
          onChange={(e) => setGuest((g) => ({ ...g, dt_of_req: e.target.value }))}
        />

        <label className={styles.label}>ID card no (optional)</label>
        <input
          className={styles.input}
          value={guest.id_card_no || ""}
          onChange={(e) => setGuest((g) => ({ ...g, id_card_no: e.target.value }))}
          placeholder="Optional"
        />

        <label className={styles.label}>Personal mobile no (optional)</label>
        <input
          className={styles.input}
          value={guest.pers_mobile_no || ""}
          onChange={(e) => setGuest((g) => ({ ...g, pers_mobile_no: e.target.value }))}
          placeholder="e.g., 01XXXXXXXXX"
        />

        <label className={styles.label}>Accompanying number</label>
        <input
          className={styles.input}
          type="number"
          min={0}
          value={String(guest.accompanying_num ?? 0)}
          onChange={(e) => setGuest((g) => ({ ...g, accompanying_num: Number(e.target.value || 0) }))}
        />

        {/* Simple toggles using native checkbox (keeps your styles stable) */}
        
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={guest.spouse}
            onChange={(e) => setGuest((g) => ({ ...g, spouse: e.target.checked }))}
          />{" "}
          Spouse
        </label>

        <label className={styles.label}>
          <input
            type="checkbox"
            checked={guest.children}
            onChange={(e) => setGuest((g) => ({ ...g, children: e.target.checked }))}
          />{" "}
          Children
        </label>

        <label className={styles.label}>
          <input
            type="checkbox"
            checked={guest.batman}
            onChange={(e) => setGuest((g) => ({ ...g, batman: e.target.checked }))}
          />{" "}
          Batman
        </label>
        <div className={styles.verticalBlock}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={guest.car}
              onChange={(e) => setGuest((g) => ({ ...g, car: e.target.checked }))}
            />{" "}
            Car
          </label>

          {guest.car ? (
            <>
              <label className={styles.label}>Car number (optional)</label>
              <input
                className={styles.input}
                value={guest.car_num || ""}
                onChange={(e) => setGuest((g) => ({ ...g, car_num: e.target.value }))}
                placeholder="Optional"
              />
            </>
          ) : null}
        </div>
        {/* Expected out is not a Guest field; it maps to Stay expectation (UI convenience) */}
        <label className={styles.label}>Expected Check-out (optional)</label>
        <input
          className={styles.input}
          type="date"
          value={expectedOut}
          onChange={(e) => setExpectedOut(e.target.value)}
        />

        {/* Photos */}
        <label className={styles.label}>Guest photos (optional)</label>
        <input className={styles.input} type="file" accept="image/*" multiple onChange={(e) => addPhotos(e.target.files)} />

        {photos.length ? (
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            {photos.map((p) => (
              <div key={p.id} style={{ display: "grid", gap: 8 }}>
                <img
                  src={p.previewUrl}
                  alt="Guest"
                  style={{ width: "100%", borderRadius: 12, objectFit: "cover", maxHeight: 220 }}
                />
                <input
                  className={styles.input}
                  value={p.note || ""}
                  onChange={(e) => setPhotoNote(p.id, e.target.value)}
                  placeholder="Photo note (optional)"
                />
                <button type="button" className={styles.btnGhost} onClick={() => removePhoto(p.id)}>
                  Remove photo
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {/* Advanced / extra Guest model fields */}
        <button type="button" className={styles.btnGhost} onClick={() => setMore((s) => !s)} style={{ marginTop: 12 }}>
          {more ? "Hide extra fields" : "Show extra fields"}
        </button>

        {more ? (
          <>
            <label className={styles.label}>Names accompanying (optional)</label>
            <input
              className={styles.input}
              value={guest.names_accompanying || ""}
              onChange={(e) => setGuest((g) => ({ ...g, names_accompanying: e.target.value }))}
            />

            <label className={styles.label}>Purpose of use (optional)</label>
            <input
              className={styles.input}
              value={guest.purpose_of_use || ""}
              onChange={(e) => setGuest((g) => ({ ...g, purpose_of_use: e.target.value }))}
            />

            <label className={styles.label}>Allot room (optional)</label>
            <input
              className={styles.input}
              value={guest.alot_room || ""}
              onChange={(e) => setGuest((g) => ({ ...g, alot_room: e.target.value }))}
            />

            <label className={styles.label}>Res 1 (optional)</label>
            <input className={styles.input} value={guest.res_1 || ""} onChange={(e) => setGuest((g) => ({ ...g, res_1: e.target.value }))} />

            <label className={styles.label}>Res 2 (optional)</label>
            <input className={styles.input} value={guest.res_2 || ""} onChange={(e) => setGuest((g) => ({ ...g, res_2: e.target.value }))} />

            <label className={styles.label}>Res 3 (optional)</label>
            <input className={styles.input} value={guest.res_3 || ""} onChange={(e) => setGuest((g) => ({ ...g, res_3: e.target.value }))} />

            <label className={styles.label}>Res 4 (optional)</label>
            <input className={styles.input} value={guest.res_4 || ""} onChange={(e) => setGuest((g) => ({ ...g, res_4: e.target.value }))} />
          </>
        ) : null}
      </div>
    </Dialog>
  );
}
