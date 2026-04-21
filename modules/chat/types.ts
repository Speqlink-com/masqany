/**
 * Chat module — domain types.
 * Covers both peer-to-peer property inquiries and the AI agent chat.
 */

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "document" | "system";
  status: MessageStatus;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[]; // user IDs
  propertyId?: string;    // linked property if this is an inquiry
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}

export interface AgentMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
