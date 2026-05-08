/**
 * Mock Property Data
 * 
 * Dummy properties in Nairobi and Rongai for testing
 */

export interface MockProperty {
  id: number;
  coords: [number, number]; // [longitude, latitude]
  price: number;
  vacant: boolean;
  title: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

export const mockProperties: MockProperty[] = [
  // Nairobi CBD
  {
    id: 1,
    coords: [36.8219, -1.2921],
    price: 25000,
    vacant: true,
    title: "Modern Studio Apartment",
    location: "Nairobi CBD",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
  },
  {
    id: 2,
    coords: [36.8233, -1.2833],
    price: 40000,
    vacant: false,
    title: "Executive 2BR Apartment",
    location: "Nairobi CBD",
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
  },

  // Westlands
  {
    id: 3,
    coords: [36.8065, -1.2676],
    price: 80000,
    vacant: true,
    title: "Luxury 3BR Penthouse",
    location: "Westlands",
    bedrooms: 3,
    bathrooms: 3,
    area: 150,
  },

  // Kilimani
  {
    id: 4,
    coords: [36.7833, -1.2927],
    price: 60000,
    vacant: true,
    title: "Spacious 2BR with Balcony",
    location: "Kilimani",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
  },

  // Rongai (Kajiado)
  {
    id: 5,
    coords: [36.7620, -1.3956],
    price: 15000,
    vacant: true,
    title: "Affordable 1BR Apartment",
    location: "Rongai",
    bedrooms: 1,
    bathrooms: 1,
    area: 50,
  },
  {
    id: 6,
    coords: [36.7585, -1.4010],
    price: 18000,
    vacant: false,
    title: "Cozy Bedsitter",
    location: "Rongai",
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
  },
  {
    id: 7,
    coords: [36.7702, -1.3885],
    price: 12000,
    vacant: true,
    title: "Budget Studio",
    location: "Rongai",
    bedrooms: 1,
    bathrooms: 1,
    area: 30,
  },
  {
    id: 8,
    coords: [36.7540, -1.4100],
    price: 10000,
    vacant: true,
    title: "Student Bedsitter",
    location: "Rongai",
    bedrooms: 1,
    bathrooms: 1,
    area: 28,
  },

  // Ngong / Kiserian nearby
  {
    id: 9,
    coords: [36.6580, -1.3610],
    price: 9000,
    vacant: true,
    title: "Serene 1BR Cottage",
    location: "Ngong",
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
  },
];

/**
 * Convert properties to GeoJSON format for Mapbox clustering
 */
export const toGeoJSON = (properties: MockProperty[]) => ({
  type: "FeatureCollection" as const,
  features: properties.map((property) => ({
    type: "Feature" as const,
    properties: {
      id: property.id,
      price: property.price,
      vacant: property.vacant,
      title: property.title,
      location: property.location,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
    },
    geometry: {
      type: "Point" as const,
      coordinates: property.coords,
    },
  })),
});
