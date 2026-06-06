/**
 * Chat module — TanStack Query hooks.
 * Provides React Query hooks for chat operations with the chat-agent microservice.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "./api";
import type {
  AgentRespondRequest,
  CreateChatRequest,
  SendMessageRequest,
  UpdateChatRequest,
} from "./types";

// ============================================================================
// Query Keys
// ============================================================================

export const chatKeys = {
  all: ["chat"] as const,
  chats: () => [...chatKeys.all, "chats"] as const,
  chat: (id: string) => [...chatKeys.all, "chat", id] as const,
  messages: (chatId: string) => [...chatKeys.all, "messages", chatId] as const,
  agent: ["chat", "agent"] as const,
};

// ============================================================================
// Chat Management Hooks
// ============================================================================

/**
 * Get all chats for the authenticated user
 */
export function useChats() {
  return useQuery({
    queryKey: chatKeys.chats(),
    queryFn: () => chatApi.getChats(),
    staleTime: 1000 * 30, // 30s — chats update frequently
  });
}

/**
 * Get a specific chat by ID
 */
export function useChat(chatId: string) {
  return useQuery({
    queryKey: chatKeys.chat(chatId),
    queryFn: () => chatApi.getChat(chatId),
    enabled: !!chatId,
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Create a new chat
 */
export function useCreateChat() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateChatRequest) => chatApi.createChat(request),
    onSuccess: () => {
      // Invalidate chats list to refetch and include new chat
      qc.invalidateQueries({ queryKey: chatKeys.chats() });
    },
  });
}

/**
 * Update chat metadata (title, pinned, archived)
 */
export function useUpdateChat() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      chatId,
      request,
    }: {
      chatId: string;
      request: UpdateChatRequest;
    }) => chatApi.updateChat(chatId, request),
    onSuccess: (data) => {
      // Invalidate specific chat and chats list
      qc.invalidateQueries({ queryKey: chatKeys.chat(data.id) });
      qc.invalidateQueries({ queryKey: chatKeys.chats() });
    },
  });
}

/**
 * Delete a chat
 */
export function useDeleteChat() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => chatApi.deleteChat(chatId),
    onSuccess: (_, chatId) => {
      // Remove from cache and refetch list
      qc.removeQueries({ queryKey: chatKeys.chat(chatId) });
      qc.invalidateQueries({ queryKey: chatKeys.chats() });
    },
  });
}

// ============================================================================
// Message Management Hooks
// ============================================================================

/**
 * Get all messages in a chat
 */
export function useMessages(chatId: string) {
  return useQuery({
    queryKey: chatKeys.messages(chatId),
    queryFn: () => chatApi.getMessages(chatId),
    enabled: !!chatId,
    staleTime: 1000 * 10, // 10s — messages need to be fresh
  });
}

/**
 * Send a message in a chat
 */
export function useSendMessage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      chatId,
      request,
    }: {
      chatId: string;
      request: SendMessageRequest;
    }) => chatApi.sendMessage(chatId, request),
    onSuccess: (_, { chatId }) => {
      // Invalidate messages to refetch and include new message
      qc.invalidateQueries({ queryKey: chatKeys.messages(chatId) });
      // Also invalidate chat to update last message
      qc.invalidateQueries({ queryKey: chatKeys.chat(chatId) });
      qc.invalidateQueries({ queryKey: chatKeys.chats() });
    },
  });
}

/**
 * Regenerate an AI response
 */
export function useRegenerateMessage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      chatId,
      messageId,
    }: {
      chatId: string;
      messageId: string;
    }) => chatApi.regenerateMessage(chatId, messageId),
    onSuccess: (_, { chatId }) => {
      // Invalidate messages to show regenerated response
      qc.invalidateQueries({ queryKey: chatKeys.messages(chatId) });
    },
  });
}

// ============================================================================
// AI Agent Hooks
// ============================================================================

/**
 * Get AI agent response (direct interaction without chat context)
 */
export function useGetAgentResponse() {
  return useMutation({
    mutationFn: (request: AgentRespondRequest) => chatApi.getAgentResponse(request),
  });
}
