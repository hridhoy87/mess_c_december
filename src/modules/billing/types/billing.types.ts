export type ChargeCategory = "ROOM_RENT" | "DINING" | "BAR" | "EXTRA";
export type PaymentMethod = "CASH" | "CARD" | "BANK" | "MOBILE";

export type Charge = {
  id: string;
  at: string; // ISO
  category: ChargeCategory;
  description: string;
  amount: number;
};

export type Payment = {
  id: string;
  at: string; // ISO
  method: PaymentMethod;
  amount: number;
};

export type Folio = {
  id: string;
  roomId: string;
  roomNumber: string;
  guestName?: string;
  charges: Charge[];
  payments: Payment[];
};
