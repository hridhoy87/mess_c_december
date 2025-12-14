import { Room } from "../types/rooms.types";

export const BUILDINGS = ["BLDG 72", "BLDG 73", "BLDG 103", "SHWAPNOLOK"] as const;

export const mockRooms: Room[] = [
  { id: "r1", number: "1", building: "BLDG 72", type: "SINGLE", capacity: 1, bed: "Single", hasTV: true, ac: "AC", status: "AVAILABLE", condition: "CLEAN", nextBooking: "2025-12-15T10:00:00Z" },
  { id: "r2", number: "2", building: "BLDG 72", type: "SINGLE", capacity: 1, bed: "Single", hasTV: true, ac: "NON_AC", status: "OCCUPIED", condition: "CLEAN" },
  { id: "r3", number: "3", building: "BLDG 72", type: "VIP", capacity: 2, bed: "Queen", hasTV: true, ac: "AC", status: "BOOKED", condition: "CLEAN", nextBooking: "2025-12-14T18:00:00Z" },
  { id: "r4", number: "4", building: "BLDG 73", type: "STUDIO", capacity: 2, bed: "Double", hasTV: true, ac: "AC", status: "RENOVATION", condition: "MAINTENANCE" },
  { id: "r5", number: "5", building: "BLDG 73", type: "SINGLE", capacity: 1, bed: "Single", hasTV: false, ac: "NON_AC", status: "AVAILABLE", condition: "DIRTY" },
  { id: "r6", number: "6", building: "SHWAPNOLOK", type: "VIP", capacity: 2, bed: "King", hasTV: true, ac: "AC", status: "OUT_OF_ORDER", condition: "MAINTENANCE" },
];
