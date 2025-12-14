export type RoomStatus = "AVAILABLE" | "BOOKED" | "OCCUPIED" | "OUT_OF_ORDER" | "RENOVATION";
export type RoomCondition = "CLEAN" | "DIRTY" | "MAINTENANCE";

export type RoomAmenity = "TV" | "AC" | "NON_AC" | "WIFI" | "GEYSER";

export type Room = {
  id: string;
  number: string;     // "1", "2", "3"
  building: string;   // "BLDG 72"
  type: "SINGLE" | "VIP" | "STUDIO";
  capacity: number;
  bed: string;        // "Single", "Double"
  hasTV: boolean;
  ac: "AC" | "NON_AC";
  status: RoomStatus;
  condition: RoomCondition;
  nextBooking?: string; // ISO string
};
