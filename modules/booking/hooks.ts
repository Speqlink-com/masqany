import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "./api";
import type { CreateBookingPayload } from "./types";

export const bookingKeys = {
  all: ["bookings"] as const,
  mine: () => [...bookingKeys.all, "mine"] as const,
  detail: (id: string) => [...bookingKeys.all, "detail", id] as const,
};

export function useMyBookings() {
  return useQuery({
    queryKey: bookingKeys.mine(),
    queryFn: () => bookingApi.getMyBookings(),
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.mine() });
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.mine() });
    },
  });
}
