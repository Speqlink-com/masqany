import { apiClient } from "@/lib/api/client";
import type { PaginatedProperties } from "@/modules/property/types";
import type { SearchFilters, SearchSuggestion } from "./types";

export const searchApi = {
  search: (filters: SearchFilters, page = 1) =>
    apiClient
      .get<PaginatedProperties>("/search/properties", {
        params: { ...filters, page },
      })
      .then((r) => r.data),

  suggestions: (query: string) =>
    apiClient
      .get<SearchSuggestion[]>("/search/suggestions", { params: { q: query } })
      .then((r) => r.data),
};
