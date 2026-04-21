import { apiClient } from "@/lib/api/client";
import type { Booking, CreateBookingPayload } from "./types";

export const bookingApi = {
  create: (payload: CreateBookingPayload) =>
    apiClient.post<Booking>("/bookings", payload).then((r) => r.data),

  getMyBookings: () =>
    apiClient.get<Booking[]>("/bookings/me").then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Booking>(`/bookings/${id}`).then((r) => r.data),

  cancel: (id: string) =>
    apiClient.post(`/bookings/${id}/cancel`).then((r) => r.data),
};
