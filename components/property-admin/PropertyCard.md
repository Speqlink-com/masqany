# PropertyCard Component

A reusable card component that displays property summary information in a compact, visually appealing format. Used primarily in the dashboard's "My Properties" section as part of a horizontal scrollable list.

## Features

- **Fixed Size**: 280px width × 180px height for consistent layout
- **Property Type Badge**: Color-coded badge showing property type (bedsitter, 1 bedroom, etc.)
- **Visual Hierarchy**: Clear information hierarchy with icons and typography
- **Touch Feedback**: Interactive with visual feedback (activeOpacity: 0.8)
- **Performance Optimized**: Wrapped with React.memo to prevent unnecessary re-renders
- **Design Token Integration**: Uses centralized design tokens for consistency
- **Responsive Text**: Truncates long property names and locations gracefully

## Props

```typescript
interface PropertyCardProps {
  property: Property;      // Property object with all details
  onPress: (propertyId: string) => void;  // Callback when card is tapped
}
```

### Property Interface

```typescript
interface Property {
  id: string;
  name: string;
  type: PropertyType;
  location: {
    estate: string;
    county: string;
    coordinates: [number, number];
  };
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number;
  pricePerUnit: number;
  monthlyRentals: number;
  currency: string;
  rating: number;
  totalViews: number;
  propertyIcon: string;
  ownerId: string;
  agentIds: string[];
  createdAt: string;
  updatedAt: string;
}
```

## Usage

### Basic Usage

```typescript
import { PropertyCard } from "@/components/property-admin";
import { useRouter } from "expo-router";

function MyComponent() {
  const router = useRouter();
  
  const handlePropertyPress = (propertyId: string) => {
    router.push(`/units/${propertyId}`);
  };
  
  return (
    <PropertyCard
      property={myProperty}
      onPress={handlePropertyPress}
    />
  );
}
```

### Horizontal Scrollable List (Dashboard)

```typescript
import { PropertyCard } from "@/components/property-admin";
import { useProperties } from "@/modules/property-admin";
import { FlatList, View, Text } from "react-native";

function MyPropertiesSection() {
  const { data, isLoading } = useProperties();
  const router = useRouter();
  
  if (isLoading) return <SkeletonLoader variant="property-cards" />;
  
  return (
    <View>
      <Text style={styles.sectionTitle}>My Properties</Text>
      <FlatList
        data={data?.properties}
        horizontal
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={(id) => router.push(`/units/${id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      />
    </View>
  );
}
```

### Grid Layout

```typescript
import { PropertyCard } from "@/components/property-admin";
import { FlatList } from "react-native";

function PropertyGrid() {
  return (
    <FlatList
      data={properties}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={{ flex: 1, margin: 8 }}>
          <PropertyCard
            property={item}
            onPress={handlePress}
          />
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

## Visual Structure

```
┌─────────────────────────────────────┐
│ [Badge: 2 Bedroom]                  │  ← Property type badge
│                                     │
│     [House Icon]                    │  ← 40×40px house icon
│                                     │
│     Kilimani Heights                │  ← Property name (16px, semibold)
│     📍 Kilimani, Nairobi            │  ← Location (13px, with icon)
│     40 Units                        │  ← Total units (13px, medium)
│     KES 45,000/unit                 │  ← Price (15px, bold, blue)
│     ⭐ 4.5                           │  ← Rating (13px, with icon)
│                                     │
└─────────────────────────────────────┘
```

## Styling Details

### Colors
- **Card Background**: `#f3f4f3` (light gray)
- **Badge Background**: `#28b4f9` (primary blue)
- **Badge Text**: White
- **Property Name**: `#000000` (black)
- **Location Text**: `#545454` (gray)
- **Price**: `#28b4f9` (primary blue)
- **Rating**: `#000000` (black)

### Typography
- **Badge**: Inter Medium, 11px
- **Property Name**: Inter SemiBold, 16px
- **Location**: Inter Regular, 13px
- **Units**: Inter Medium, 13px
- **Price**: Inter Bold, 15px
- **Rating**: Inter Medium, 13px

### Spacing
- **Card Padding**: 16px
- **Card Margin Right**: 16px (spacing between cards)
- **Badge Padding**: 8px horizontal, 2px vertical
- **Element Spacing**: 4-8px between elements

### Shadow
- Uses `shadow.md` token from design system
- Creates subtle depth effect

## Helper Functions

### formatPropertyType(type: string): string
Converts property type enum to display format:
- `bedsitter` → "Bedsitter"
- `1_bedroom` → "1 Bedroom"
- `2_bedroom` → "2 Bedroom"
- `3_bedroom` → "3 Bedroom"
- `4_bedroom_plus` → "4 Bedroom Plus"
- `studio` → "Studio"
- `penthouse` → "Penthouse"

### formatCurrency(amount: number, currency: string): string
Formats price with currency and locale-specific number formatting:
- `45000, "KES"` → "KES 45,000"
- `120000, "KES"` → "KES 120,000"

## Performance Considerations

### React.memo Optimization
The component is wrapped with `React.memo` to prevent unnecessary re-renders. It will only re-render when:
- The `property` prop changes (shallow comparison)
- The `onPress` prop changes

**Best Practice**: Use `useCallback` for the `onPress` handler to maintain referential equality:

```typescript
const handlePress = useCallback((propertyId: string) => {
  router.push(`/units/${propertyId}`);
}, [router]);

<PropertyCard property={item} onPress={handlePress} />
```

### Image Optimization
- Uses `resizeMode="contain"` for efficient image rendering
- Icons are pre-loaded from assets for instant display

### Text Truncation
- Property name and location use `numberOfLines={1}` to prevent layout overflow
- Long text is truncated with ellipsis (...)

## Accessibility

### Touch Target
- Entire card is tappable (280×180px = 50,400px²)
- Well above minimum touch target size (44×44px)

### Visual Feedback
- `activeOpacity={0.8}` provides clear visual feedback on press
- Smooth transition for better user experience

### Text Readability
- High contrast ratios for all text elements
- Appropriate font sizes (minimum 11px)
- Clear visual hierarchy

## Dependencies

### Required Assets
- `assets/icons/house-icon.webp` - Property icon (40×40px)
- `assets/icons/location.png` - Location pin icon (14×14px)
- `assets/icons/star.png` - Rating star icon (14×14px)

### Required Modules
- `@/modules/property-admin/types` - Property interface
- `@/constants/tokens` - Design tokens (colors, typography, spacing, shadow, radius)

### React Native Components
- `TouchableOpacity` - Touch interaction
- `View` - Layout container
- `Text` - Text rendering
- `Image` - Icon rendering
- `StyleSheet` - Style optimization

## Testing

### Unit Tests
Located in `__tests__/PropertyCard.test.tsx`

**Test Coverage:**
- ✅ Renders correctly with property data
- ✅ Formats property type correctly
- ✅ Handles singular unit correctly
- ✅ Calls onPress with property id when tapped
- ✅ Formats different property types correctly
- ✅ Formats currency correctly
- ✅ Displays rating with one decimal place
- ✅ Truncates long property names
- ✅ Truncates long location names

### Manual Testing Checklist
- [ ] Card displays all information correctly
- [ ] Badge shows correct property type
- [ ] Icons load and display properly
- [ ] Text truncates for long names/locations
- [ ] Touch feedback works (opacity change)
- [ ] onPress callback fires with correct property ID
- [ ] Card maintains size in different layouts
- [ ] Spacing between cards is consistent

## Common Issues & Solutions

### Issue: Icons not displaying
**Solution**: Verify icon files exist in `assets/icons/` directory:
```bash
ls -la assets/icons/ | grep -E "(house-icon|location|star)"
```

### Issue: Text overflow
**Solution**: Component uses `numberOfLines={1}` for truncation. Ensure parent container has proper width constraints.

### Issue: Performance lag in long lists
**Solution**: 
1. Ensure `React.memo` is working (check with React DevTools)
2. Use `useCallback` for `onPress` handler
3. Implement `getItemLayout` in FlatList for better performance

### Issue: Inconsistent spacing
**Solution**: Verify `marginRight: spacing.base` is applied and parent FlatList has proper `contentContainerStyle`.

## Related Components

- **AnalyticsCard** - Similar card component for analytics metrics
- **RoomCard** - Card component for individual units
- **SkeletonLoader** - Loading placeholder for PropertyCard
- **EmptyState** - Empty state when no properties exist

## Design Tokens Used

```typescript
import { colors, radius, shadow, spacing, typography } from "@/constants/tokens";

// Colors
colors.light[400]    // White
colors.dark[400]     // Black
"#f3f4f3"           // Card background
"#28b4f9"           // Primary blue
"#545454"           // Gray text

// Typography
typography.family.regular    // Inter Regular
typography.family.medium     // Inter Medium
typography.family.semibold   // Inter SemiBold
typography.family.bold       // Inter Bold

// Spacing
spacing.xs    // 4px
spacing.sm    // 8px
spacing.base  // 16px
spacing.xl    // 24px

// Radius
radius.md     // 10px

// Shadow
shadow.md     // Medium shadow
```

## Version History

- **v1.0.0** (2024-01-22) - Initial implementation
  - Fixed size card (280×180px)
  - Property type badge
  - All required information display
  - React.memo optimization
  - Design token integration
  - Comprehensive test coverage

## Maintainers

- Property Admin Module Team

## License

Internal use only - Masqany Mobile App
