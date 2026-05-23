/**
 * GradientHeader Usage Examples
 * 
 * This file demonstrates how to use the GradientHeader component
 * in both dashboard and units variants.
 */

import GradientHeader from "./GradientHeader";

// Example 1: Dashboard Variant
export function DashboardHeaderExample() {
  return (
    <GradientHeader
      variant="dashboard"
      onMenuPress={() => console.log("Menu pressed")}
      onHomePress={() => console.log("Home pressed")}
      onNotificationPress={() => console.log("Notification pressed")}
    />
  );
}

// Example 2: Units Variant
export function UnitsHeaderExample() {
  const propertyData = {
    icon: require("@/assets/icons/house-icon.webp"),
    title: "Kilimani Heights",
    location: "Kilimani, Nairobi",
    totalRooms: 40,
    pricePerMonth: 45000,
    monthlyRentals: 1575000,
    occupancyRatio: "35/40",
  };

  return (
    <GradientHeader
      variant="units"
      propertyData={propertyData}
      onSearchPress={() => console.log("Search pressed")}
      onSwitchProperty={() => console.log("Switch property pressed")}
    />
  );
}

// Example 3: Units Variant with Different Property
export function UnitsHeaderExample2() {
  const propertyData = {
    icon: require("@/assets/icons/house-icon.webp"),
    title: "Westlands Residency",
    location: "Westlands, Nairobi",
    totalRooms: 24,
    pricePerMonth: 35000,
    monthlyRentals: 700000,
    occupancyRatio: "20/24",
  };

  return (
    <GradientHeader
      variant="units"
      propertyData={propertyData}
      onSearchPress={() => console.log("Search pressed")}
      onSwitchProperty={() => console.log("Switch property pressed")}
    />
  );
}
