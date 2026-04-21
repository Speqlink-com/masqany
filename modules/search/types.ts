export interface SearchFilters {
  query?: string;
  category?: string;
  city?: string;
  county?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  radius?: number; // km from a lat/lng center
  lat?: number;
  lng?: number;
}

export interface SearchSuggestion {
  id: string;
  label: string;
  type: "city" | "property" | "category";
}
