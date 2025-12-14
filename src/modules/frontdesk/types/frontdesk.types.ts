export type StayStatus = "CHECKED_IN" | "CHECKED_OUT";

export type Stay = {
  id: string;
  roomId: string;
  roomNumber: string;
  guestName: string;
  phone?: string;
  checkInAt: string;   // ISO
  expectedOutAt?: string; // ISO
  status: StayStatus;
};
