import { Folio } from "../types/billing.types";

export const mockFolioByRoomNumber: Record<string, Folio> = {
  "2": {
    id: "f-2",
    roomId: "r2",
    roomNumber: "2",
    guestName: "Mr. X (placeholder)",
    charges: [
      { id: "c1", at: new Date().toISOString(), category: "ROOM_RENT", description: "Room rent (1 night)", amount: 3000 },
      { id: "c2", at: new Date().toISOString(), category: "DINING", description: "Lunch", amount: 900 },
      { id: "c3", at: new Date().toISOString(), category: "BAR", description: "Bar", amount: 600 },
    ],
    payments: [
      { id: "p1", at: new Date().toISOString(), method: "CASH", amount: 2000 },
    ],
  },
};
