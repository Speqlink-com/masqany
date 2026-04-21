/**
 * Global shared types — used across modules.
 * Module-specific types live in their own modules/[domain]/types.ts files.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isHost: boolean;
  isVerified: boolean;
  createdAt: string;
}

// Re-export domain types for convenience
export type { Booking, BookingStatus } from "@/modules/booking/types";
export type { ChatMessage, Conversation } from "@/modules/chat/types";
export type { Property, PropertyCategory, PropertyStatus } from "@/modules/property/types";

