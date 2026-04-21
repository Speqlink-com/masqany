/**
 * Property module — API bindings.
 */

import { apiClient } from "@/lib/api/client";
import type {
    PaginatedProperties,
    Property,
    PropertyListParams,
} from "./types";

export const propertyApi = {
  list: (params: PropertyListParams) =>
    apiClient
      .get<PaginatedProperties>("/properties", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Property>(`/properties/${id}`).then((r) => r.data),

  getFeed: (pageParam: number, limit = 10) =>
    apiClient
      .get<PaginatedProperties>("/properties/feed", {
        params: { page: pageParam, limit },
      })
      .then((r) => r.data),

  bookmark: (id: string) =>
    apiClient.post(`/properties/${id}/bookmark`).then((r) => r.data),

  removeBookmark: (id: string) =>
    apiClient.delete(`/properties/${id}/bookmark`).then((r) => r.data),

  getBookmarks: () =>
    apiClient.get<Property[]>("/properties/bookmarks").then((r) => r.data),

  register: (formData: FormData) =>
    apiClient
      .post<Property>("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
};
