/**
 * Chat module — API bindings.
 * Integrates with chat-agent microservice for AI-powered property search and assistance.
 * Real-time messaging via WebSocket can be added later.
 * 
 * Base URL: /api/chat-agent
 */

import { apiClient } from "@/lib/api/client";
import type {
  AgentRespondRequest,
  AgentResponse,
  Chat,
  CreateChatRequest,
  Message,
  SendMessageRequest,
  UpdateChatRequest,
} from "./types";

// Helper to generate session ID (device-specific)
// In a real app, you might store this in AsyncStorage for persistence
let cachedSessionId: string | null = null;

function getSessionId(): string {
  if (!cachedSessionId) {
    cachedSessionId = `session-${Date.now()}`;
  }
  return cachedSessionId;
}

/**
 * Chat Agent API
 * All endpoints require X-User-Id and X-Session-Id headers (handled by apiClient)
 */
export const chatApi = {
  // =========================================================================
  // Chat Management
  // =========================================================================

  /**
   * Get all chats for the authenticated user
   * GET /api/chat-agent/chats
   */
  getChats: async (): Promise<Chat[]> => {
    console.log("[CHAT API] Fetching all chats...");
    try {
      const response = await apiClient.get<Chat[]>("/api/chat-agent/chats", {
        headers: {
          "X-Session-Id": getSessionId(),
        },
      });
      console.log("[CHAT API] ✅ Chats fetched:", response.data.length);
      return response.data;
    } catch (err: any) {
      console.error("[CHAT API] ❌ Failed to fetch chats:", err);
      throw err;
    }
  },

  /**
   * Create a new chat
   * POST /api/chat-agent/chats
   */
  createChat: async (request: CreateChatRequest): Promise<Chat> => {
    console.log("[CHAT API] Creating new chat:", request.title);
    try {
      const response = await apiClient.post<Chat>("/api/chat-agent/chats", request, {
        headers: {
          "X-Session-Id": getSessionId(),
        },
      });
      console.log("[CHAT API] ✅ Chat created:", response.data.id);
      return response.data;
    } catch (err: any) {
      console.error("[CHAT API] ❌ Failed to create chat:", err);
      throw err;
    }
  },

  /**
   * Get a specific chat by ID
   * GET /api/chat-agent/chats/{chat_id}
   */
  getChat: async (chatId: string): Promise<Chat> => {
    console.log("[CHAT API] Fetching chat:", chatId);
    try {
      const response = await apiClient.get<Chat>(`/api/chat-agent/chats/${chatId}`, {
        headers: {
          "X-Session-Id": getSessionId(),
        },
      });
      console.log("[CHAT API] ✅ Chat fetched:", response.data.id);
      return response.data;
    } catch (err: any) {
      console.error("[CHAT API] ❌ Failed to fetch chat:", err);
      throw err;
    }
  },

  /**
   * Update chat metadata (title, pinned, archived)
   * PATCH /api/chat-agent/chats/{chat_id}
   */
  updateChat: async (chatId: string, request: UpdateChatRequest): Promise<Chat> => {
    console.log("[CHAT API] Updating chat:", chatId, request);
    try {
      const response = await apiClient.patch<Chat>(
        `/api/chat-agent/chats/${chatId}`,
        request,
        {
          headers: {
            "X-Session-Id": getSessionId(),
          },
        }
      );
      console.log("[CHAT API] ✅ Chat updated:", response.data.id);
      return response.data;
    } catch (err: any) {
      console.error("[CHAT API] ❌ Failed to update chat:", err);
      throw err;
    }
  },

  /**
   * Delete a chat
   * DELETE /api/chat-agent/chats/{chat_id}
   */
  deleteChat: async (chatId: string): Promise<void> => {
    console.log("[CHAT API] Deleting chat:", chatId);
    try {
      await apiClient.delete(`/api/chat-agent/chats/${chatId}`, {
        headers: {
          "X-Session-Id": getSessionId(),
        },
      });
      console.log("[CHAT API] ✅ Chat deleted:", chatId);
    } catch (err: any) {
      console.error("[CHAT API] ❌ Failed to delete chat:", err);
      throw err;
    }
  },

  // =========================================================================
  // Message Management
  // =========================================================================

  /**
   * Get all messages in a chat
   * GET /api/chat-agent/chats/{chat_id}/messages
   */
  getMessages: async (chatId: string): Promise<Message[]> => {
    console.log("[CHAT API] Fetching messages for chat:", chatId);
    try {
      const response = await apiClient.get<Message[]>(
        `/api/chat-agent/chats/${chatId}/messages`,
        {
          headers: {
            "X-Session-Id": getSessionId(),
          },
        }
      );
      console.log("[CHAT API] ✅ Messages fetched:", response.data.length);
      return response.data;
    } catch (err: any) {
      console.error("[CHAT API] ❌ Failed to fetch messages:", err);
      throw err;
    }
  },

  /**
   * Send a message in a chat
   * POST /api/chat-agent/chats/{chat_id}/messages
   */
  sendMessage: async (chatId: string, request: SendMessageRequest): Promise<Message> => {
    console.log("[CHAT API] Sending message to chat:", chatId);
    try {
      const response = await apiClient.post<Message>(
        `/api/chat-agent/chats/${chatId}/messages`,
        request,
        {
          headers: {
            "X-Session-Id": getSessionId(),
          },
        }
      );
      console.log("[CHAT API] ✅ Message sent:", response.data.id);
      return response.data;
    } catch (err: any) {
      console.error("[CHAT API] ❌ Failed to send message:", err);
      throw err;
    }
  },

  /**
   * Regenerate an AI response
   * POST /api/chat-agent/chats/{chat_id}/messages/{message_id}/regenerate
   */
  regenerateMessage: async (chatId: string, messageId: string): Promise<Message> => {
    console.log("[CHAT API] Regenerating message:", messageId);
    try {
      const response = await apiClient.post<Message>(
        `/api/chat-agent/chats/${chatId}/messages/${messageId}/regenerate`,
        {},
        {
          headers: {
            "X-Session-Id": getSessionId(),
          },
        }
      );
      console.log("[CHAT API] ✅ Message regenerated:", response.data.id);
      return response.data;
    } catch (err: any) {
      console.error("[CHAT API] ❌ Failed to regenerate message:", err);
      throw err;
    }
  },

  // =========================================================================
  // AI Agent Endpoints
  // =========================================================================

  /**
   * Get AI agent response
   * POST /api/chat-agent/agent/respond
   */
  getAgentResponse: async (request: AgentRespondRequest): Promise<AgentResponse> => {
    console.log("[CHAT API] Getting AI response for:", request.message.substring(0, 50));
    console.log("[CHAT API] Input chat_id:", request.chat_id);
    
    // Build request payload - completely omit chat_id if not provided
    const payload: { message: string; chat_id?: string } = {
      message: request.message,
    };
    
    // Only add chat_id if it's a valid string
    if (request.chat_id && typeof request.chat_id === 'string') {
      payload.chat_id = request.chat_id;
    }
    
    console.log("[CHAT API] Final payload:", JSON.stringify(payload));
    console.log("[CHAT API] Session ID:", getSessionId());
    
    try {
      const response = await apiClient.post<AgentResponse>(
        "/api/chat-agent/agent/respond",
        payload,
        {
          headers: {
            "X-Session-Id": getSessionId(),
          },
        }
      );
      console.log("[CHAT API] ✅ AI response received:", JSON.stringify(response.data));
      return response.data;
    } catch (err: any) {
      console.error("[CHAT API] ❌ Failed to get AI response:", err);
      console.error("[CHAT API] ❌ Error code:", err.code);
      console.error("[CHAT API] ❌ Error message:", err.message);
      console.error("[CHAT API] ❌ Response status:", err.response?.status);
      console.error("[CHAT API] ❌ Response data:", JSON.stringify(err.response?.data));
      console.error("[CHAT API] ❌ Request URL:", err.config?.url);
      console.error("[CHAT API] ❌ Request baseURL:", err.config?.baseURL);
      console.error("[CHAT API] ❌ Full URL:", err.config?.baseURL + err.config?.url);
      throw err;
    }
  },

  // =========================================================================
  // Utility
  // =========================================================================

  /**
   * Get current session ID
   */
  getSessionId,

  /**
   * Reset session ID (useful for logout)
   */
  resetSessionId: () => {
    cachedSessionId = null;
  },
};
