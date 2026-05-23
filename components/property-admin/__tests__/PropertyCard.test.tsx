/**
 * PropertyCard Component Tests
 * 
 * Tests for the PropertyCard component to ensure it renders correctly
 * and handles user interactions properly.
 */

import { Property } from "@/modules/property-admin/types";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import PropertyCard from "../PropertyCard";

// Mock property data
const mockProperty: Property = {
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
};

describe("PropertyCard", () => {
  it("renders correctly with property data", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PropertyCard property={mockProperty} onPress={onPress} />
    );

    // Check if property name is rendered
    expect(getByText("Kilimani Heights")).toBeTruthy();

    // Check if location is rendered
    expect(getByText("Kilimani, Nairobi")).toBeTruthy();

    // Check if units count is rendered
    expect(getByText("40 Units")).toBeTruthy();

    // Check if price is rendered
    expect(getByText("KES 45,000/unit")).toBeTruthy();

    // Check if rating is rendered
    expect(getByText("4.5")).toBeTruthy();
  });

  it("formats property type correctly", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PropertyCard property={mockProperty} onPress={onPress} />
    );

    // Check if property type badge is formatted correctly
    expect(getByText("2 Bedroom")).toBeTruthy();
  });

  it("handles singular unit correctly", () => {
    const onPress = jest.fn();
    const singleUnitProperty = { ...mockProperty, totalUnits: 1 };
    const { getByText } = render(
      <PropertyCard property={singleUnitProperty} onPress={onPress} />
    );

    // Check if singular "Unit" is used
    expect(getByText("1 Unit")).toBeTruthy();
  });

  it("calls onPress with property id when tapped", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PropertyCard property={mockProperty} onPress={onPress} />
    );

    // Tap on the card
    fireEvent.press(getByText("Kilimani Heights"));

    // Check if onPress was called with correct property id
    expect(onPress).toHaveBeenCalledWith("prop-001");
  });

  it("formats different property types correctly", () => {
    const onPress = jest.fn();
    const testCases = [
      { type: "bedsitter" as const, expected: "Bedsitter" },
      { type: "1_bedroom" as const, expected: "1 Bedroom" },
      { type: "3_bedroom" as const, expected: "3 Bedroom" },
      { type: "4_bedroom_plus" as const, expected: "4 Bedroom Plus" },
      { type: "studio" as const, expected: "Studio" },
      { type: "penthouse" as const, expected: "Penthouse" },
    ];

    testCases.forEach(({ type, expected }) => {
      const property = { ...mockProperty, type };
      const { getByText } = render(
        <PropertyCard property={property} onPress={onPress} />
      );
      expect(getByText(expected)).toBeTruthy();
    });
  });

  it("formats currency correctly", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PropertyCard property={mockProperty} onPress={onPress} />
    );

    // Check if currency is formatted with commas
    expect(getByText("KES 45,000/unit")).toBeTruthy();
  });

  it("displays rating with one decimal place", () => {
    const onPress = jest.fn();
    const propertyWithRating = { ...mockProperty, rating: 4.7 };
    const { getByText } = render(
      <PropertyCard property={propertyWithRating} onPress={onPress} />
    );

    // Check if rating is displayed with one decimal
    expect(getByText("4.7")).toBeTruthy();
  });

  it("truncates long property names", () => {
    const onPress = jest.fn();
    const longNameProperty = {
      ...mockProperty,
      name: "This is a very long property name that should be truncated",
    };
    const { getByText } = render(
      <PropertyCard property={longNameProperty} onPress={onPress} />
    );

    // Component should render without crashing
    expect(
      getByText("This is a very long property name that should be truncated")
    ).toBeTruthy();
  });

  it("truncates long location names", () => {
    const onPress = jest.fn();
    const longLocationProperty = {
      ...mockProperty,
      location: {
        estate: "Very Long Estate Name",
        county: "Very Long County Name",
        coordinates: [36.7821, -1.2921] as [number, number],
      },
    };
    const { getByText } = render(
      <PropertyCard property={longLocationProperty} onPress={onPress} />
    );

    // Component should render without crashing
    expect(getByText("Very Long Estate Name, Very Long County Name")).toBeTruthy();
  });
});
