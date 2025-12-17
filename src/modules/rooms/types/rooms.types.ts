export type RoomStatus = "AVAILABLE" | "BOOKED" | "OCCUPIED" | "OUT_OF_ORDER" | "RENOVATION" | "CLEANING" | "MAINTENANCE";
export type RoomCondition = "CLEAN" | "DIRTY" | "MAINTENANCE";

export type Room = {
  // Backend fields
  id: string;
  building_id: string;
  room_type_id: string;
  room_number: string;
  floor?: number | null;
  status: string;  // Changed from optional to required
  is_active?: boolean;
  capacity?: number;
  beds?: string;
  has_tv?: boolean;
  has_ac?: boolean;
  other_amenity?: string | null;
  next_booking?: string | null;
  
  // UI-only fields (must be present for components)
  building?: string;
  number?: string;  // Same as room_number
  type?: string;
  ac?: "AC" | "NON_AC";
  condition?: RoomCondition;
  hasTV?: boolean;
  bed?: string;
  nextBooking?: string;  // For backward compatibility
};