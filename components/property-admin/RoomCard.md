# RoomCard Component

## Overview

The `RoomCard` component displays an individual unit in a grid layout with status-based color coding. It's used in the units screen to show all units of a property in a 4-per-row grid.

## Features

- **Square Layout**: Equal width and height with rounded corners (12px)
- **Status-Based Colors**:
  - Occupied: Green (#22C55E)
  - Vacant: Blue (#28b4f9)
  - Vacant Soon: Yellow (#F59E0B)
- **Status Icon**: 28x28px white icon at the top
- **Room Number**: Customizable format (A1, B12, 101, Room 1)
- **Status Text**: Clear status label
- **Tick Mark**: Confirmation indicator at the bottom
- **Performance**: Optimized with React.memo
- **Spacing**: 8px spacing between cards

## Props

```typescript
interface RoomCardProps {
  unit: Unit;
  onPress: (unitId: string) => void;
}
```

### `unit` (required)

Type: `Unit`

The unit object containing all unit information:

```typescript
interface Unit {
  id: string;
  propertyId: string;
  roomNumber: string; // Customizable: "A5", "B12", "101", "Room 1"
  status: UnitStatus; // 'occupied' | 'vacant' | 'vacant_soon'
  bedrooms: number;
  bathrooms: number;
  size?: number;
  price: number;
  tenantId?: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  lastUpdated: string;
  updatedBy: string;
}
```

### `onPress` (required)

Type: `(unitId: string) => void`

Callback function triggered when the card is tapped. Receives the unit ID as a parameter.

## Usage

### Basic Usage

```tsx
import { RoomCard } from "@/components/property-admin";
import { Unit } from "@/modules/property-admin/types";

function UnitsScreen() {
  const handleUnitPress = (unitId: string) => {
    console.log("Unit pressed:", unitId);
    // Open status change modal
    openStatusModal();
    setSelectedUnit(unitId);
  };

  return (
    <RoomCard
      unit={unit}
      onPress={handleUnitPress}
    />
  );
}
```

### Grid Layout (4 per row)

```tsx
import { FlatList, View } from "react-native";
import { RoomCard } from "@/components/property-admin";

function UnitsGrid({ units }: { units: Unit[] }) {
  const handleUnitPress = (unitId: string) => {
    // Handle unit press
  };

  return (
    <FlatList
      data={units}
      numColumns={4}
      renderItem={({ item }) => (
        <View style={{ flex: 1, maxWidth: "23%", aspectRatio: 1 }}>
          <RoomCard unit={item} onPress={handleUnitPress} />
        </View>
      )}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={{ justifyContent: "space-between" }}
    />
  );
}
```

### With Status Modal Integration

```tsx
import { RoomCard } from "@/components/property-admin";
import { usePropertyAdminStore } from "@/modules/property-admin";

function UnitsScreen() {
  const { openStatusModal, setSelectedUnit } = usePropertyAdminStore();

  const handleUnitPress = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    if (unit) {
      setSelectedUnit(unit);
      openStatusModal();
    }
  };

  return (
    <RoomCard
      unit={unit}
      onPress={handleUnitPress}
    />
  );
}
```

## Status Colors

The card background color changes based on the unit status:

| Status | Color | Hex Code | Use Case |
|--------|-------|----------|----------|
| Occupied | Green | #22C55E | Unit has an active tenant |
| Vacant | Blue | #28b4f9 | Unit is available for rent |
| Vacant Soon | Yellow | #F59E0B | Current lease ending soon |

## Room Number Formats

The component supports various room numbering formats:

- **Letter-Number**: A1, A2, B1, B2
- **Numeric**: 101, 102, 201, 202
- **Text**: Room 1, Room 2, Unit 1
- **Mixed**: A5, B12, C3

## Styling

The component uses design tokens from `constants/tokens.ts`:

```typescript
import { colors, radius, spacing, typography } from "@/constants/tokens";
```

### Key Styles

- **Border Radius**: 12px
- **Padding**: 8px (spacing.sm)
- **Margin**: 4px (8px spacing between cards)
- **Aspect Ratio**: 1:1 (square)
- **Font Family**: Inter Bold (room number), Inter Medium (status text)
- **Font Sizes**: 18px (room number), 12px (status text)
- **Icon Sizes**: 28x28px (status icon), 16x16px (tick mark)

## Performance

The component is wrapped with `React.memo` to prevent unnecessary re-renders:

```typescript
const RoomCard = React.memo(({ unit, onPress }: RoomCardProps) => {
  // Component implementation
});
```

This is important when rendering large grids with many units (40+ units per property).

## Accessibility

- **Tappable Area**: Full card is tappable with `activeOpacity={0.8}`
- **Text Truncation**: Room number and status text truncate with `numberOfLines={1}`
- **Color Contrast**: White text on colored backgrounds meets WCAG AA standards

## Examples

See `RoomCard.example.tsx` for complete usage examples:

1. **UnitGridExample**: 4-per-row grid layout (primary usage)
2. **StatusVariationsExample**: Different status colors
3. **RoomNumberVariationsExample**: Different numbering formats
4. **ResponsiveGridExample**: 2-column layout for smaller screens
5. **MixedStatusGridExample**: Realistic mixed status scenario

## Related Components

- **StatusModal**: Modal for changing unit status
- **GradientHeader**: Header for units screen
- **SkeletonLoader**: Loading state for unit grid

## Requirements

Implements requirements:
- 7.1-7.26: Unit grid display and room card specifications
- 23.7, 23.8: Component structure and styling
- 23.10, 23.11: Typography and spacing
- 23.13, 23.14: Performance optimization

## Notes

- The component uses `vaccant-prop-icon.webp` for both vacant and vacant_soon statuses
- The tick mark icon uses `black-check-icon.webp` with white tint
- All icons are tinted white for visibility on colored backgrounds
- The component is designed for mobile screens with 4 cards per row
