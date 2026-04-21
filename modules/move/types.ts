export type VehicleType = "pickup" | "van" | "truck";
export type MoveStatus = "pending" | "confirmed" | "in_transit" | "completed" | "cancelled";

export interface MoveRequest {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledAt: string;
  estimatedPrice: number;
  status: MoveStatus;
  driverId?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateMovePayload {
  vehicleType: VehicleType;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledAt: string;
  notes?: string;
}
