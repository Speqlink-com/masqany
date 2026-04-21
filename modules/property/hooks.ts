/**
 * Property module — TanStack Query hooks.
 *
 * usePropertyFeed uses infiniteQuery — the correct primitive for a
 * TikTok-style paginated feed. Each page is fetched on demand as the
 * user scrolls, and results are cached per page.
 */

import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { propertyApi } from "./api";
import type { PropertyListParams } from "./types";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (params: PropertyListParams) =>
    [...propertyKeys.lists(), params] as const,
  feed: () => [...propertyKeys.all, "feed"] as const,
  detail: (id: string) => [...propertyKeys.all, "detail", id] as const,
  bookmarks: () => [...propertyKeys.all, "bookmarks"] as const,
};

// ---------------------------------------------------------------------------
// Property list (search results, category browsing)
// ---------------------------------------------------------------------------
export function useProperties(params: PropertyListParams = {}) {
  return useQuery({
    queryKey: propertyKeys.list(params),
    queryFn: () => propertyApi.list(params),
    staleTime: 1000 * 60 * 2, // 2 min — search results go stale faster
  });
}

// ---------------------------------------------------------------------------
// Infinite feed — TikTok-style vertical scroll
// ---------------------------------------------------------------------------
export function usePropertyFeed() {
  return useInfiniteQuery({
    queryKey: propertyKeys.feed(),
    queryFn: ({ pageParam }) => propertyApi.getFeed(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 3,
  });
}

// ---------------------------------------------------------------------------
// Single property detail
// ---------------------------------------------------------------------------
export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyApi.getById(id),
    enabled: !!id,
  });
}

// ---------------------------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------------------------
export function useBookmarks() {
  return useQuery({
    queryKey: propertyKeys.bookmarks(),
    queryFn: () => propertyApi.getBookmarks(),
  });
}

export function useToggleBookmark() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isBookmarked,
    }: {
      id: string;
      isBookmarked: boolean;
    }) =>
      isBookmarked
        ? propertyApi.removeBookmark(id)
        : propertyApi.bookmark(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertyKeys.bookmarks() });
      qc.invalidateQueries({ queryKey: propertyKeys.feed() });
    },
  });
}

// ---------------------------------------------------------------------------
// Property registration
// ---------------------------------------------------------------------------
export function useRegisterProperty() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => propertyApi.register(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}
