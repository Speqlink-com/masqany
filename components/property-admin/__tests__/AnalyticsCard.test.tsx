/**
 * AnalyticsCard Component Tests
 * 
 * Tests for the AnalyticsCard component used in the property admin dashboard.
 */

import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import AnalyticsCard from "../AnalyticsCard";

describe("AnalyticsCard", () => {
  const mockIcon = require("@/assets/icons/occupied-prop-icon.png");

  it("renders correctly with all props", () => {
    const { getByText } = render(
      <AnalyticsCard
        icon={mockIcon}
        value={35}
        label="Occupied"
      />
    );

    expect(getByText("35")).toBeTruthy();
    expect(getByText("Occupied")).toBeTruthy();
  });

  it("renders string values correctly", () => {
    const { getByText } = render(
      <AnalyticsCard
        icon={mockIcon}
        value="85%"
        label="Occupancy Rate"
      />
    );

    expect(getByText("85%")).toBeTruthy();
    expect(getByText("Occupancy Rate")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <AnalyticsCard
        icon={mockIcon}
        value={1234}
        label="Views"
        onPress={mockOnPress}
      />
    );

    fireEvent.press(getByText("1234"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("does not crash when onPress is not provided", () => {
    const { getByText } = render(
      <AnalyticsCard
        icon={mockIcon}
        value={5}
        label="Vacant"
      />
    );

    expect(getByText("5")).toBeTruthy();
    expect(getByText("Vacant")).toBeTruthy();
  });

  it("renders with numeric value 0", () => {
    const { getByText } = render(
      <AnalyticsCard
        icon={mockIcon}
        value={0}
        label="Vacant"
      />
    );

    expect(getByText("0")).toBeTruthy();
  });
});
