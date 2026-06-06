/**
 * Chat module — domain types.
 * Covers both peer-to-peer property inquiries and the AI agent chat.
 * Updated to match backend chat-agent microservice API schema.
 */

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";
export type ChatStatus = "active" | "archived" | "deleted";
export type ChatMode = "start" | "plan";

// ============================================================================
// AI Agent Chat Types (Backend-aligned)
// ============================================================================

/**
 * Chat session type from backend
 */
export interface Chat {
  id: string;
  user_id: string;
  session_id: string;
  title: string;
  pinned: boolean;
  archived: boolean;
  status: ChatStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Message type from backend
 */
export interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  message_metadata?: {
    model?: string;
    tokens_used?: number;
    response_time_ms?: number;
    regenerated?: boolean;
    property_ids?: string[];
    suggestions?: string[];
  };
  edited: boolean;
  regenerated: boolean;
  created_at: string;
}

/**
 * Create chat request
 */
export interface CreateChatRequest {
  title?: string;
}

/**
 * Update chat request
 */
export interface UpdateChatRequest {
  title?: string;
  pinned?: boolean;
  archived?: boolean;
}

/**
 * Send message request
 */
export interface SendMessageRequest {
  content: string;
}

/**
 * AI agent response request
 */
export interface AgentRespondRequest {
  message: string;
  chat_id?: string;
}

/**
 * AI agent response
 */
export interface AgentResponse {
  answer: string;  // Main response text
  response?: string; // Alternative field name
  chat_id?: string;
  tool_used?: string | null;
  property_id?: string | null;
  metadata?: {
    model?: string;
    tokens_used?: number;
    response_time_ms?: number;
  };
}

// ============================================================================
// Legacy P2P Chat Types (for future peer-to-peer feature)
// ============================================================================

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
