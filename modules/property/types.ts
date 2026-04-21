/**
 * Property module — domain types.
 * These extend the base types in /types/index.ts with property-specific shapes.
 */

export type PropertyCategory =
  | "apartment"
  | "house"
  | "studio"
  | "villa"
  | "hostel"
  | "room"
  | "condo"
  | "townhouse"
  | "other";

export type PropertyStatus = "available" | "rented" | "sold" | "pending";

export interface PropertyMedia {
  id: string;
  url: string;
  type: "image" | "video";
  thumbnail?: string;
  order: number;
}

export interface PropertyLocation {
  address: string;
  city: string;
  county: string;
  country: string;
  latitude: number;
  longitude: number;
  plusCode?: string;
}

export interface PropertyAmenity {
  id: string;
  label: string;
  icon: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  pricePeriod: "monthly" | "yearly" | "nightly" | "sale";
  category: PropertyCategory;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area: number; // sq meters
  location: PropertyLocation;
  amenities: PropertyAmenity[];
  media: PropertyMedia[];
  hostId: string;
  rating: number;
  reviewCount: number;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyListParams {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  query?: string;
}

export interface PaginatedProperties {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}
