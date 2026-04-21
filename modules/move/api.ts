import { apiClient } from "@/lib/api/client";
import type { CreateMovePayload, MoveRequest } from "./types";

export const moveApi = {
  create: (payload: CreateMovePayload) =>
    apiClient.post<MoveRequest>("/moves", payload).then((r) => r.data),

  getMyMoves: () =>
    apiClient.get<MoveRequest[]>("/moves/me").then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<MoveRequest>(`/moves/${id}`).then((r) => r.data),

  cancel: (id: string) =>
    apiClient.post(`/moves/${id}/cancel`).then((r) => r.data),

  getEstimate: (payload: Omit<CreateMovePayload, "scheduledAt">) =>
    apiClient
      .post<{ estimatedPrice: number; currency: string }>("/moves/estimate", payload)
      .then((r) => r.data),
};
