# AnalyticsCard Component

## Overview

The `AnalyticsCard` component displays individual metrics with an icon, numeric/string value, and descriptive label. It's used in the Property Admin dashboard's analytics grid (2x2 layout) to show key performance indicators like occupied units, vacant units, occupancy rate, and total views.

## Features

- ✅ Clean, card-based design with shadow and rounded corners
- ✅ Supports both numeric and string values (e.g., "85%" for percentages)
- ✅ Optional tap interaction with customizable onPress handler
- ✅ Performance optimized with React.memo
- ✅ Uses design tokens for consistent styling
- ✅ Accessible and responsive layout

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `icon` | `ImageSourcePropType` | Yes | Icon image source (32x32px recommended) |
| `value` | `number \| string` | Yes | Metric value to display (e.g., 35 or "87.5%") |
| `label` | `string` | Yes | Descriptive label below the value |
| `onPress` | `() => void` | No | Optional callback when card is tapped |

## Design Specifications

### Layout
- **Background**: #f3f4f3 (light gray)
- **Border Radius**: 10px (medium)
- **Padding**: 16px
- **Shadow**: Medium elevation shadow
- **Min Height**: 120px
- **Alignment**: Center-aligned content

### Typography
- **Value**: 
  - Font: Poppins Bold
  - Size: 24px
  - Color: #000000 (black)
- **Label**: 
  - Font: Inter Medium
  - Size: 13px
  - Color: #545454 (gray)
  - Alignment: Center

### Icon
- **Size**: 32x32px
- **Position**: Top of card
- **Margin Bottom**: 8px

### Interaction
- **Active Opacity**: 0.8 (when tappable)
- **Touch Feedback**: Visual opacity change on press

## Usage Examples

### Basic Usage (Non-tappable)

```tsx
import { AnalyticsCard } from "@/components/property-admin";

<AnalyticsCard
  icon={require("@/assets/icons/occupied-prop-icon.png")}
  value={35}
  label="Occupied"
/>
```

### With Tap Handler

```tsx
import { AnalyticsCard } from "@/components/property-admin";
import { useRouter } from "expo-router";

function Dashboard() {
  const router = useRouter();

  return (
    <AnalyticsCard
      icon={require("@/assets/icons/occupancy-icon.png")}
      value="87.5%"
      label="Occupancy Rate"
      onPress={() => router.push("/(property-admin)/analytics?metric=occupancy")}
    />
  );
}
```

### Dashboard Grid Layout (2x2)

```tsx
import { View, StyleSheet } from "react-native";
import { AnalyticsCard } from "@/components/property-admin";
import { spacing } from "@/constants/tokens";

function AnalyticsGrid() {
  return (
    <View style={styles.container}>
      {/* Row 1 */}
      <View style={styles.row}>
        <View style={styles.cardWrapper}>
          <AnalyticsCard
            icon={require("@/assets/icons/occupied-prop-icon.png")}
            value={35}
            label="Occupied"
          />
        </View>
        <View style={styles.cardWrapper}>
          <AnalyticsCard
            icon={require("@/assets/icons/vaccant-prop-icon.webp")}
            value={5}
            label="Vacant"
          />
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <View style={styles.cardWrapper}>
          <AnalyticsCard
            icon={require("@/assets/icons/occupancy-icon.png")}
            value="87.5%"
            label="Occupancy Rate"
          />
        </View>
        <View style={styles.cardWrapper}>
          <AnalyticsCard
            icon={require("@/assets/icons/views-icon.png")}
            value={1234}
            label="Views"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
  },
  row: {
    flexDirection: "row",
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  cardWrapper: {
    flex: 1,
  },
});
```

## Icon Assets

The following icon assets are used with AnalyticsCard in the Property Admin dashboard:

- **Occupied**: `assets/icons/occupied-prop-icon.png`
- **Vacant**: `assets/icons/vaccant-prop-icon.webp` (note: typo in filename)
- **Occupancy Rate**: `assets/icons/occupancy-icon.png`
- **Views**: `assets/icons/views-icon.png`

## Performance Considerations

- Component is wrapped with `React.memo` to prevent unnecessary re-renders
- Only re-renders when props change
- Efficient for use in lists or grids with multiple cards
- Minimal layout calculations due to fixed sizing

## Accessibility

- Text content is automatically accessible to screen readers
- Value and label are read together as a single metric
- Tappable cards are properly marked as touchable elements
- Sufficient color contrast for readability

## Requirements Validation

This component satisfies the following requirements from the Property Admin spec:

- ✅ 3.1-3.22: Analytics cards display and layout
- ✅ 23.6: Design tokens usage
- ✅ 23.10: Typography specifications
- ✅ 23.11: Color specifications
- ✅ 23.14: Shadow and elevation

## Related Components

- **GradientHeader**: Header component for dashboard and units screens
- **PropertyCard**: Card component for property list
- **RoomCard**: Card component for unit grid

## Notes

- The component uses StyleSheet.create() instead of NativeWind classes for precise control over styling
- Design tokens are imported from `constants/tokens.ts` for consistency
- The card automatically adjusts to flex layout when used in a grid
- String values (like percentages) are supported for flexibility
