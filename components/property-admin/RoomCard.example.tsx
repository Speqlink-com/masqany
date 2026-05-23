/**
 * RoomCard Component Example
 * 
 * This file demonstrates how to use the RoomCard component
 * in different scenarios.
 */

import { Unit } from "@/modules/property-admin/types";
import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import RoomCard from "./RoomCard";

// Mock unit data for examples
const mockUnits: Unit[] = [
  // Occupied units
  {
    id: "unit-001",
    propertyId: "prop-001",
    roomNumber: "A1",
    status: "occupied",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    tenantId: "tenant-001",
    leaseStartDate: "2024-01-01T00:00:00Z",
    leaseEndDate: "2024-12-31T23:59:59Z",
    lastUpdated: "2024-01-15T10:30:00Z",
    updatedBy: "owner-001",
  },
  {
    id: "unit-002",
    propertyId: "prop-001",
    roomNumber: "A2",
    status: "occupied",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    tenantId: "tenant-002",
    leaseStartDate: "2024-01-01T00:00:00Z",
    leaseEndDate: "2024-12-31T23:59:59Z",
    lastUpdated: "2024-01-15T10:30:00Z",
    updatedBy: "owner-001",
  },
  // Vacant units
  {
    id: "unit-003",
    propertyId: "prop-001",
    roomNumber: "B1",
    status: "vacant",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    lastUpdated: "2024-01-20T14:45:00Z",
    updatedBy: "owner-001",
  },
  {
    id: "unit-004",
    propertyId: "prop-001",
    roomNumber: "B2",
    status: "vacant",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    lastUpdated: "2024-01-20T14:45:00Z",
    updatedBy: "owner-001",
  },
  // Vacant soon units
  {
    id: "unit-005",
    propertyId: "prop-001",
    roomNumber: "C1",
    status: "vacant_soon",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    tenantId: "tenant-005",
    leaseStartDate: "2024-01-01T00:00:00Z",
    leaseEndDate: "2024-02-28T23:59:59Z",
    lastUpdated: "2024-01-15T10:30:00Z",
    updatedBy: "owner-001",
  },
  {
    id: "unit-006",
    propertyId: "prop-001",
    roomNumber: "C2",
    status: "vacant_soon",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    tenantId: "tenant-006",
    leaseStartDate: "2024-01-01T00:00:00Z",
    leaseEndDate: "2024-02-28T23:59:59Z",
    lastUpdated: "2024-01-15T10:30:00Z",
    updatedBy: "owner-001",
  },
  // Additional units with different room numbers
  {
    id: "unit-007",
    propertyId: "prop-001",
    roomNumber: "101",
    status: "occupied",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    tenantId: "tenant-007",
    leaseStartDate: "2024-01-01T00:00:00Z",
    leaseEndDate: "2024-12-31T23:59:59Z",
    lastUpdated: "2024-01-15T10:30:00Z",
    updatedBy: "owner-001",
  },
  {
    id: "unit-008",
    propertyId: "prop-001",
    roomNumber: "102",
    status: "vacant",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    lastUpdated: "2024-01-20T14:45:00Z",
    updatedBy: "owner-001",
  },
  {
    id: "unit-009",
    propertyId: "prop-001",
    roomNumber: "Room 1",
    status: "occupied",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    tenantId: "tenant-009",
    leaseStartDate: "2024-01-01T00:00:00Z",
    leaseEndDate: "2024-12-31T23:59:59Z",
    lastUpdated: "2024-01-15T10:30:00Z",
    updatedBy: "owner-001",
  },
  {
    id: "unit-010",
    propertyId: "prop-001",
    roomNumber: "Room 2",
    status: "vacant_soon",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    tenantId: "tenant-010",
    leaseStartDate: "2024-01-01T00:00:00Z",
    leaseEndDate: "2024-02-28T23:59:59Z",
    lastUpdated: "2024-01-15T10:30:00Z",
    updatedBy: "owner-001",
  },
  {
    id: "unit-011",
    propertyId: "prop-001",
    roomNumber: "A5",
    status: "vacant",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    lastUpdated: "2024-01-20T14:45:00Z",
    updatedBy: "owner-001",
  },
  {
    id: "unit-012",
    propertyId: "prop-001",
    roomNumber: "B12",
    status: "occupied",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    price: 45000,
    tenantId: "tenant-012",
    leaseStartDate: "2024-01-01T00:00:00Z",
    leaseEndDate: "2024-12-31T23:59:59Z",
    lastUpdated: "2024-01-15T10:30:00Z",
    updatedBy: "owner-001",
  },
];

/**
 * Example 1: Unit Grid (4 per row) - Primary Usage
 * This is the primary use case for RoomCard in the units screen
 */
export function UnitGridExample() {
  const handleUnitPress = (unitId: string) => {
    console.log("Unit pressed:", unitId);
    // Open status change modal
    // openStatusModal();
    // setSelectedUnit(unit);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Property Units</Text>
      <FlatList
        data={mockUnits}
        numColumns={4}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <RoomCard unit={item} onPress={handleUnitPress} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

/**
 * Example 2: Status Variations
 * Demonstrates how different unit statuses are displayed
 */
export function StatusVariationsExample() {
  const handleUnitPress = (unitId: string) => {
    console.log("Unit pressed:", unitId);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Unit Status Variations</Text>
      
      <Text style={styles.subsectionTitle}>Occupied (Green)</Text>
      <View style={styles.row}>
        <RoomCard unit={mockUnits[0]} onPress={handleUnitPress} />
        <RoomCard unit={mockUnits[1]} onPress={handleUnitPress} />
      </View>
      
      <Text style={styles.subsectionTitle}>Vacant (Blue)</Text>
      <View style={styles.row}>
        <RoomCard unit={mockUnits[2]} onPress={handleUnitPress} />
        <RoomCard unit={mockUnits[3]} onPress={handleUnitPress} />
      </View>
      
      <Text style={styles.subsectionTitle}>Vacant Soon (Yellow)</Text>
      <View style={styles.row}>
        <RoomCard unit={mockUnits[4]} onPress={handleUnitPress} />
        <RoomCard unit={mockUnits[5]} onPress={handleUnitPress} />
      </View>
    </ScrollView>
  );
}

/**
 * Example 3: Room Number Variations
 * Shows different room numbering formats
 */
export function RoomNumberVariationsExample() {
  const handleUnitPress = (unitId: string) => {
    console.log("Unit pressed:", unitId);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Room Number Variations</Text>
      
      <Text style={styles.subsectionTitle}>Letter-Number Format (A1, B2)</Text>
      <View style={styles.row}>
        <RoomCard unit={mockUnits[0]} onPress={handleUnitPress} />
        <RoomCard unit={mockUnits[1]} onPress={handleUnitPress} />
      </View>
      
      <Text style={styles.subsectionTitle}>Numeric Format (101, 102)</Text>
      <View style={styles.row}>
        <RoomCard unit={mockUnits[6]} onPress={handleUnitPress} />
        <RoomCard unit={mockUnits[7]} onPress={handleUnitPress} />
      </View>
      
      <Text style={styles.subsectionTitle}>Text Format (Room 1, Room 2)</Text>
      <View style={styles.row}>
        <RoomCard unit={mockUnits[8]} onPress={handleUnitPress} />
        <RoomCard unit={mockUnits[9]} onPress={handleUnitPress} />
      </View>
      
      <Text style={styles.subsectionTitle}>Mixed Format (A5, B12)</Text>
      <View style={styles.row}>
        <RoomCard unit={mockUnits[10]} onPress={handleUnitPress} />
        <RoomCard unit={mockUnits[11]} onPress={handleUnitPress} />
      </View>
    </ScrollView>
  );
}

/**
 * Example 4: Responsive Grid (2 columns for smaller screens)
 * Alternative layout for smaller screens or tablets
 */
export function ResponsiveGridExample() {
  const handleUnitPress = (unitId: string) => {
    console.log("Unit pressed:", unitId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Responsive Grid (2 columns)</Text>
      <FlatList
        data={mockUnits.slice(0, 8)}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.gridItemLarge}>
            <RoomCard unit={item} onPress={handleUnitPress} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

/**
 * Example 5: Mixed Status Grid
 * Realistic scenario with mixed unit statuses
 */
export function MixedStatusGridExample() {
  const handleUnitPress = (unitId: string) => {
    console.log("Unit pressed:", unitId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mixed Status Grid</Text>
      <Text style={styles.subtitle}>
        Occupied: {mockUnits.filter(u => u.status === 'occupied').length} | 
        Vacant: {mockUnits.filter(u => u.status === 'vacant').length} | 
        Vacant Soon: {mockUnits.filter(u => u.status === 'vacant_soon').length}
      </Text>
      <FlatList
        data={mockUnits}
        numColumns={4}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <RoomCard unit={item} onPress={handleUnitPress} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#545454",
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#545454",
    marginTop: 16,
    marginBottom: 8,
  },
  gridContent: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  gridItem: {
    flex: 1,
    maxWidth: "23%", // 4 columns with spacing
    aspectRatio: 1,
  },
  gridItemLarge: {
    flex: 1,
    maxWidth: "48%", // 2 columns with spacing
    aspectRatio: 1,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

// Export all examples
export default {
  UnitGridExample,
  StatusVariationsExample,
  RoomNumberVariationsExample,
  ResponsiveGridExample,
  MixedStatusGridExample,
};
