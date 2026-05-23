/**
 * PropertyCard Component Example
 * 
 * This file demonstrates how to use the PropertyCard component
 * in different scenarios.
 */

import { Property } from "@/modules/property-admin/types";
import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import PropertyCard from "./PropertyCard";

// Mock property data for examples
const mockProperties: Property[] = [
  {
    id: "prop-001",
    name: "Kilimani Heights",
    type: "2_bedroom",
    location: {
      estate: "Kilimani",
      county: "Nairobi",
      coordinates: [36.7821, -1.2921],
    },
    totalUnits: 40,
    occupiedUnits: 35,
    vacantUnits: 5,
    occupancyRate: 87.5,
    pricePerUnit: 45000,
    monthlyRentals: 1575000,
    currency: "KES",
    rating: 4.5,
    totalViews: 1234,
    propertyIcon: "house-icon.webp",
    ownerId: "owner-001",
    agentIds: ["agent-001", "agent-002"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
  },
  {
    id: "prop-002",
    name: "Westlands Residency",
    type: "1_bedroom",
    location: {
      estate: "Westlands",
      county: "Nairobi",
      coordinates: [36.8097, -1.2676],
    },
    totalUnits: 24,
    occupiedUnits: 20,
    vacantUnits: 4,
    occupancyRate: 83.33,
    pricePerUnit: 35000,
    monthlyRentals: 700000,
    currency: "KES",
    rating: 4.2,
    totalViews: 892,
    propertyIcon: "house-icon.webp",
    ownerId: "owner-001",
    agentIds: ["agent-001"],
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T11:20:00Z",
  },
  {
    id: "prop-003",
    name: "Karen Gardens",
    type: "3_bedroom",
    location: {
      estate: "Karen",
      county: "Nairobi",
      coordinates: [36.7073, -1.3197],
    },
    totalUnits: 16,
    occupiedUnits: 16,
    vacantUnits: 0,
    occupancyRate: 100,
    pricePerUnit: 75000,
    monthlyRentals: 1200000,
    currency: "KES",
    rating: 4.8,
    totalViews: 2156,
    propertyIcon: "house-icon.webp",
    ownerId: "owner-001",
    agentIds: ["agent-002"],
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-22T16:30:00Z",
  },
  {
    id: "prop-004",
    name: "Lavington Suites",
    type: "bedsitter",
    location: {
      estate: "Lavington",
      county: "Nairobi",
      coordinates: [36.7685, -1.2833],
    },
    totalUnits: 32,
    occupiedUnits: 28,
    vacantUnits: 4,
    occupancyRate: 87.5,
    pricePerUnit: 28000,
    monthlyRentals: 784000,
    currency: "KES",
    rating: 4.0,
    totalViews: 678,
    propertyIcon: "house-icon.webp",
    ownerId: "owner-001",
    agentIds: ["agent-001", "agent-003"],
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-19T09:15:00Z",
  },
  {
    id: "prop-005",
    name: "Runda Villas",
    type: "penthouse",
    location: {
      estate: "Runda",
      county: "Nairobi",
      coordinates: [36.7833, -1.2167],
    },
    totalUnits: 8,
    occupiedUnits: 7,
    vacantUnits: 1,
    occupancyRate: 87.5,
    pricePerUnit: 120000,
    monthlyRentals: 840000,
    currency: "KES",
    rating: 4.9,
    totalViews: 3421,
    propertyIcon: "house-icon.webp",
    ownerId: "owner-001",
    agentIds: ["agent-002"],
    createdAt: "2024-01-08T10:00:00Z",
    updatedAt: "2024-01-21T14:00:00Z",
  },
];

/**
 * Example 1: Horizontal Scrollable List (Dashboard Usage)
 * This is the primary use case for PropertyCard in the dashboard
 */
export function HorizontalPropertyListExample() {
  const handlePropertyPress = (propertyId: string) => {
    console.log("Property pressed:", propertyId);
    // Navigate to property details screen
    // router.push(`/units/${propertyId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>My Properties</Text>
      <FlatList
        data={mockProperties}
        horizontal
        renderItem={({ item }) => (
          <PropertyCard property={item} onPress={handlePropertyPress} />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

/**
 * Example 2: Vertical Grid Layout
 * Alternative layout for property listing screens
 */
export function VerticalPropertyGridExample() {
  const handlePropertyPress = (propertyId: string) => {
    console.log("Property pressed:", propertyId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>All Properties</Text>
      <FlatList
        data={mockProperties}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <PropertyCard property={item} onPress={handlePropertyPress} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
      />
    </View>
  );
}

/**
 * Example 3: Single Property Card
 * Standalone usage for featured property or property preview
 */
export function SinglePropertyCardExample() {
  const handlePropertyPress = (propertyId: string) => {
    console.log("Property pressed:", propertyId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Featured Property</Text>
      <PropertyCard
        property={mockProperties[2]} // Karen Gardens
        onPress={handlePropertyPress}
      />
    </View>
  );
}

/**
 * Example 4: Property Cards with Different Types
 * Demonstrates how different property types are displayed
 */
export function PropertyTypeVariationsExample() {
  const handlePropertyPress = (propertyId: string) => {
    console.log("Property pressed:", propertyId);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Property Type Variations</Text>
      
      <Text style={styles.subsectionTitle}>Bedsitter</Text>
      <PropertyCard
        property={mockProperties[3]} // Lavington Suites
        onPress={handlePropertyPress}
      />
      
      <Text style={styles.subsectionTitle}>1 Bedroom</Text>
      <PropertyCard
        property={mockProperties[1]} // Westlands Residency
        onPress={handlePropertyPress}
      />
      
      <Text style={styles.subsectionTitle}>2 Bedroom</Text>
      <PropertyCard
        property={mockProperties[0]} // Kilimani Heights
        onPress={handlePropertyPress}
      />
      
      <Text style={styles.subsectionTitle}>3 Bedroom</Text>
      <PropertyCard
        property={mockProperties[2]} // Karen Gardens
        onPress={handlePropertyPress}
      />
      
      <Text style={styles.subsectionTitle}>Penthouse</Text>
      <PropertyCard
        property={mockProperties[4]} // Runda Villas
        onPress={handlePropertyPress}
      />
    </ScrollView>
  );
}

/**
 * Example 5: Property Cards with Different Occupancy Rates
 * Shows how cards display different occupancy scenarios
 */
export function OccupancyVariationsExample() {
  const handlePropertyPress = (propertyId: string) => {
    console.log("Property pressed:", propertyId);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Occupancy Variations</Text>
      
      <Text style={styles.subsectionTitle}>Fully Occupied (100%)</Text>
      <PropertyCard
        property={mockProperties[2]} // Karen Gardens - 100%
        onPress={handlePropertyPress}
      />
      
      <Text style={styles.subsectionTitle}>High Occupancy (87.5%)</Text>
      <PropertyCard
        property={mockProperties[0]} // Kilimani Heights - 87.5%
        onPress={handlePropertyPress}
      />
      
      <Text style={styles.subsectionTitle}>Medium Occupancy (83.33%)</Text>
      <PropertyCard
        property={mockProperties[1]} // Westlands Residency - 83.33%
        onPress={handlePropertyPress}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#545454",
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingRight: 16,
  },
  gridContent: {
    paddingBottom: 16,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    alignItems: "center",
  },
});

// Export all examples
export default {
  HorizontalPropertyListExample,
  VerticalPropertyGridExample,
  SinglePropertyCardExample,
  PropertyTypeVariationsExample,
  OccupancyVariationsExample,
};
