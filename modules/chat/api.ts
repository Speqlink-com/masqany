/**
 * Chat module — API bindings.
 * Real-time messaging will use WebSocket (see lib/ws/client.ts placeholder).
 * REST endpoints handle history, conversation list, and AI agent turns.
 */

import { apiClient } from "@/lib/api/client";
import type { AgentMessage, ChatMessage, Conversation } from "./types";

export const chatApi = {
  getConversations: () =>
    apiClient.get<Conversation[]>("/chat/conversations").then((r) => r.data),

  getMessages: (conversationId: string, page = 1) =>
    apiClient
      .get<{ data: ChatMessage[]; hasMore: boolean }>(
        `/chat/conversations/${conversationId}/messages`,
        { params: { page, limit: 30 } }
      )
      .then((r) => r.data),

  sendMessage: (conversationId: string, content: string) =>
    apiClient
      .post<ChatMessage>(`/chat/conversations/${conversationId}/messages`, {
        content,
      })
      .then((r) => r.data),

  // AI agent endpoint
  sendAgentMessage: (content: string, sessionId?: string) =>
    apiClient
      .post<AgentMessage>("/agent/chat", { content, sessionId })
      .then((r) => r.data),
};
