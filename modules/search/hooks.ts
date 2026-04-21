import { useQuery } from "@tanstack/react-query";
import { searchApi } from "./api";
import type { SearchFilters } from "./types";

export const searchKeys = {
  results: (filters: SearchFilters) => ["search", "results", filters] as const,
  suggestions: (q: string) => ["search", "suggestions", q] as const,
};

export function useSearch(filters: SearchFilters, enabled = true) {
  return useQuery({
    queryKey: searchKeys.results(filters),
    queryFn: () => searchApi.search(filters),
    enabled: enabled && !!(filters.query || filters.city || filters.category),
    staleTime: 1000 * 60 * 2,
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: searchKeys.suggestions(query),
    queryFn: () => searchApi.suggestions(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60,
  });
}
