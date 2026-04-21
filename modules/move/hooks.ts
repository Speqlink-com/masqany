import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { moveApi } from "./api";
import type { CreateMovePayload } from "./types";

export const moveKeys = {
  all: ["moves"] as const,
  mine: () => [...moveKeys.all, "mine"] as const,
  detail: (id: string) => [...moveKeys.all, "detail", id] as const,
};

export function useMyMoves() {
  return useQuery({
    queryKey: moveKeys.mine(),
    queryFn: () => moveApi.getMyMoves(),
  });
}

export function useCreateMove() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMovePayload) => moveApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: moveKeys.mine() });
    },
  });
}

export function useMoveEstimate() {
  return useMutation({
    mutationFn: (payload: Omit<CreateMovePayload, "scheduledAt">) =>
      moveApi.getEstimate(payload),
  });
}
