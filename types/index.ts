/**
 * Global shared types — used across modules.
 * Module-specific types live in their own modules/[domain]/types.ts files.
 */

export type UserRole = 
  | "tenant" 
  | "property_owner" 
  | "property_agent" 
  | "relocation_driver" 
  | "admin" 
  | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isHost: boolean;
  isVerified: boolean;
  createdAt: string;
}

// Re-export domain types for convenience
export type { Booking, BookingStatus } from "@/modules/booking/types";
export type { ChatMessage, Conversation } from "@/modules/chat/types";
export type {
    LongStayProperty, Property,
    PropertyCategory,
    PropertyStatus, ShortStayProperty,
    StayType
} from "@/modules/property/types";

