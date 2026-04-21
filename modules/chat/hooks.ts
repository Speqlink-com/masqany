/**
 * Chat module — TanStack Query hooks.
 */

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "./api";

export const chatKeys = {
  conversations: ["chat", "conversations"] as const,
  messages: (id: string) => ["chat", "messages", id] as const,
  agent: ["chat", "agent"] as const,
};

export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations,
    queryFn: () => chatApi.getConversations(),
    staleTime: 1000 * 30, // 30s — conversations update frequently
  });
}

export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: ({ pageParam }) =>
      chatApi.getMessages(conversationId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last, _, lastPageParam) =>
      last.hasMore ? (lastPageParam as number) + 1 : undefined,
    enabled: !!conversationId,
  });
}

export function useSendMessage(conversationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      chatApi.sendMessage(conversationId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chatKeys.messages(conversationId) });
      qc.invalidateQueries({ queryKey: chatKeys.conversations });
    },
  });
}

export function useSendAgentMessage() {
  return useMutation({
    mutationFn: ({
      content,
      sessionId,
    }: {
      content: string;
      sessionId?: string;
    }) => chatApi.sendAgentMessage(content, sessionId),
  });
}
