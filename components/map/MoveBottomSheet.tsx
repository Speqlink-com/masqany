import { PropertyCard } from "@/components/map/PropertyCard";
import { mockProperties } from "@/constants/mockProperties";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const pickupIcon = require("@/assets/icons/pickup.webp");
const destinationIcon = require("@/assets/icons/pinned-location.png");
const vehicleIcon = require("@/assets/icons/pickup-vehicle-icon.png");

const SNAP_FRACTIONS = [0.7, 0.5, 0.3] as const;
const SPRING_CONFIG = { damping: 22, stiffness: 190 };
const vacantProperties = mockProperties.filter((property) => property.vacant);

interface MoveBottomSheetProps {
  bottomInset: number;
  selectedPropertyId: number | null;
  onSelectProperty: (propertyId: number) => void;
  onOpenProperty: (propertyId: number) => void;
  onSnapChange: (fraction: number) => void;
}

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(value, min), max);
}

export function MoveBottomSheet({
  bottomInset,
  selectedPropertyId,
  onSelectProperty,
  onOpenProperty,
  onSnapChange,
}: MoveBottomSheetProps) {
  const { height } = useWindowDimensions();
  const availableHeight = Math.max(height - bottomInset, 1);
  const expandedHeight = availableHeight * SNAP_FRACTIONS[0];
  const maxOffset = availableHeight * (SNAP_FRACTIONS[0] - SNAP_FRACTIONS[2]);
  const translateY = useSharedValue(0);
  const dragStartY = useSharedValue(0);

  const notifySnap = (index: number) => {
    onSnapChange(SNAP_FRACTIONS[index]);
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      dragStartY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = clamp(dragStartY.value + event.translationY, 0, maxOffset);
    })
    .onEnd((event) => {
      const projectedY = clamp(translateY.value + event.velocityY * 0.12, 0, maxOffset);
      const snapOffsets = [0, availableHeight * 0.2, availableHeight * 0.4];
      const nearestIndex = snapOffsets.reduce((bestIndex, offset, index) => {
        const currentDistance = Math.abs(projectedY - offset);
        const bestDistance = Math.abs(projectedY - snapOffsets[bestIndex]);
        return currentDistance < bestDistance ? index : bestIndex;
      }, 0);

      translateY.value = withSpring(snapOffsets[nearestIndex], SPRING_CONFIG);
      runOnJS(notifySnap)(nearestIndex);
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.sheet,
        {
          height: expandedHeight,
          bottom: bottomInset,
        },
        sheetStyle,
      ]}
    >
      <GestureDetector gesture={panGesture}>
        <View style={styles.dragArea}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.eyebrow}>Move planning</Text>
              <Text style={styles.title}>Nearby homes and movers</Text>
            </View>
            <View style={styles.etaPill}>
              <Ionicons name="flash" size={15} color="#20A6FD" />
              <Text style={styles.etaText}>12 min</Text>
            </View>
          </View>
        </View>
      </GestureDetector>

      <View style={styles.routePanel}>
        <View style={styles.routeItem}>
          <Image source={pickupIcon} style={styles.routeIcon} resizeMode="contain" />
          <View style={styles.routeCopy}>
            <Text style={styles.routeLabel}>Pickup</Text>
            <Text style={styles.routeValue} numberOfLines={1}>Current location</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.routeItem}>
          <Image source={destinationIcon} style={styles.routeIcon} resizeMode="contain" />
          <View style={styles.routeCopy}>
            <Text style={styles.routeLabel}>Destination</Text>
            <Text style={styles.routeValue} numberOfLines={1}>Suggested drop-off point</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.vehicleButton} activeOpacity={0.85}>
          <Image source={vehicleIcon} style={styles.vehicleIcon} resizeMode="contain" />
          <Text style={styles.vehicleText}>Pickup</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Properties around you</Text>
        <Text style={styles.sectionMeta}>{vacantProperties.length} live</Text>
      </View>

      <FlashList
        style={styles.list}
        data={vacantProperties}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            selected={selectedPropertyId === item.id}
            onPress={() => {
              onSelectProperty(item.id);
              onOpenProperty(item.id);
            }}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 16,
    overflow: "hidden",
    zIndex: 20,
  },
  dragArea: {
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: "#F8FAFC",
  },
  handle: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  eyebrow: {
    color: "#64748B",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
  },
  title: {
    color: "#0F172A",
    fontFamily: "CG-Bold",
    fontSize: 21,
  },
  etaPill: {
    minWidth: 72,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EAF7FF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  etaText: {
    color: "#0F172A",
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
  },
  routePanel: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  routeItem: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 94,
  },
  routeIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  routeCopy: {
    flex: 1,
  },
  routeLabel: {
    color: "#64748B",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 11,
  },
  routeValue: {
    color: "#111827",
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginLeft: 34,
    marginVertical: 5,
    backgroundColor: "#E2E8F0",
  },
  vehicleButton: {
    position: "absolute",
    right: 12,
    top: 18,
    width: 76,
    height: 66,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleIcon: {
    width: 54,
    height: 29,
  },
  vehicleText: {
    marginTop: 2,
    color: "#334155",
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
  },
  sectionHeader: {
    marginHorizontal: 18,
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#0F172A",
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
  },
  sectionMeta: {
    color: "#20A6FD",
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 28,
  },
});
