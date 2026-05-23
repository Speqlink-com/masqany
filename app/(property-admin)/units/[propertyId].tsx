/**
 * Property Units Screen
 * 
 * Displays all units for a specific property in a 4-column grid layout.
 * 
 * Features:
 * - Dynamic route with propertyId parameter
 * - Gradient header with property info (units variant)
 * - 4-per-row unit grid with RoomCard components
 * - Pull-to-refresh functionality
 * - Loading states with skeleton loaders
 * - Empty state when no units
 * - Error handling with retry
 * - Tap unit card to open status modal
 */

import {
    EmptyState,
    GradientHeader,
    RoomCard,
    SkeletonLoader,
    StatusModal
} from "@/components/property-admin";
import {
    useProperty,
    usePropertyAdminStore,
    usePropertyUnits,
    useUpdateUnitStatus
} from "@/modules/property-admin";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
    FlatList,
    ImageBackground,
    RefreshControl,
    Text,
    View
} from "react-native";

export default function UnitsScreen() {
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const {
    isStatusModalOpen,
    openStatusModal,
    closeStatusModal,
    selectedUnit,
    setSelectedUnit,
  } = usePropertyAdminStore();

  // Fetch property data for header
  const {
    data: propertyData,
    isLoading: propertyLoading,
    error: propertyError,
    refetch: refetchProperty,
  } = useProperty(propertyId || "", { enabled: !!propertyId });

  // Fetch units data
  const {
    data: unitsData,
    isLoading: unitsLoading,
    error: unitsError,
    refetch: refetchUnits,
  } = usePropertyUnits(propertyId || "", { enabled: !!propertyId });

  // Update unit status mutation
  const updateUnitStatus = useUpdateUnitStatus();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchProperty(), refetchUnits()]);
    setRefreshing(false);
  }, [refetchProperty, refetchUnits]);

  // Handle unit card press
  const handleUnitPress = React.useCallback(
    (unitId: string) => {
      const unit = unitsData?.units.find((u) => u.id === unitId);
      if (unit) {
        setSelectedUnit(unit);
        openStatusModal();
      }
    },
    [unitsData, setSelectedUnit, openStatusModal]
  );

  // Handle status change confirmation
  const handleStatusChange = React.useCallback(
    (unitId: string, newStatus: any) => {
      updateUnitStatus.mutate(
        {
          propertyId: propertyId || "",
          unitId,
          status: newStatus,
        },
        {
          onSuccess: () => {
            closeStatusModal();
            // Show success toast (you can add a toast library later)
            console.log("Status updated successfully");
          },
          onError: (error) => {
            // Show error toast
            console.error("Failed to update status:", error);
          },
        }
      );
    },
    [propertyId, updateUnitStatus, closeStatusModal]
  );

  // Calculate property metrics for header
  const propertyHeaderData = React.useMemo(() => {
    if (!propertyData || !unitsData || !unitsData.units) return null;

    const occupiedUnits = unitsData.units.filter(
      (u) => u.status === "occupied"
    ).length;
    const totalUnits = unitsData.units.length;
    const occupancyRatio = totalUnits > 0
      ? `${occupiedUnits}/${totalUnits}`
      : "0/0";

    // Calculate monthly rentals (sum of occupied unit prices)
    const monthlyRentals = unitsData.units
      .filter((u) => u.status === "occupied")
      .reduce((sum, u) => sum + (u.pricePerMonth || 0), 0);

    return {
      icon: require("@/assets/icons/house-icon.webp"),
      title: propertyData.name,
      location: propertyData.location?.address || "",
      totalRooms: totalUnits,
      pricePerMonth: propertyData.pricing?.basePrice || 0,
      monthlyRentals,
      occupancyRatio,
    };
  }, [propertyData, unitsData]);

  // Show loading state
  if (propertyLoading || unitsLoading) {
    return (
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#20A6FD] z-50" />
        <View className="h-[25vh] bg-gray-200" />
        <View className="flex-1 px-5 pt-5">
          <SkeletonLoader variant="unit-grid" />
        </View>
        <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-40">
          <View className="h-[1px] bg-black" />
        </View>
      </ImageBackground>
    );
  }

  // Show error state
  if (propertyError || unitsError) {
    return (
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#20A6FD] z-50" />
        <View className="h-[25vh] bg-gray-200" />
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-red-600 text-center text-[16px] font-inter-semibold mb-4">
            Failed to load property data
          </Text>
          <Text className="text-[#545454] text-center text-[14px] font-inter mb-6">
            {propertyError?.message || unitsError?.message || "Please try again"}
          </Text>
          <View className="bg-[#28b4f9] px-6 py-3 rounded-full">
            <Text
              className="text-white text-[15px] font-inter-semibold"
              onPress={onRefresh}
            >
              Retry
            </Text>
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-40">
          <View className="h-[1px] bg-black" />
        </View>
      </ImageBackground>
    );
  }

  // Show empty state
  if (!unitsData || unitsData.units.length === 0) {
    return (
      <ImageBackground
        source={require("@/assets/images/app-full-screen.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#20A6FD] z-50" />
        {propertyHeaderData && (
          <GradientHeader
            variant="units"
            propertyData={propertyHeaderData}
            onSearchPress={() => {}}
            onSwitchProperty={() => {}}
          />
        )}
        <View className="flex-1">
          <EmptyState
            variant="no-units"
            onActionPress={() => {}}
          />
        </View>
        <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-40">
          <View className="h-[1px] bg-black" />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("@/assets/images/app-full-screen.webp")}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Top Bar - Blue bar protecting status bar */}
      <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#20A6FD] z-50" />
      {/* Gradient Header with Property Info */}
      {propertyHeaderData && (
        <GradientHeader
          variant="units"
          propertyData={propertyHeaderData}
          onSearchPress={() => {}}
          onSwitchProperty={() => {}}
        />
      )}

      {/* Units Grid */}
      <FlatList
        data={unitsData.units}
        numColumns={4}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width: "25%" }}>
            <RoomCard unit={item} onPress={handleUnitPress} />
          </View>
        )}
        contentContainerStyle={{ padding: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#20A6FD"
          />
        }
        // Performance optimizations
        removeClippedSubviews
        maxToRenderPerBatch={20}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 100, // Approximate card height
          offset: 100 * Math.floor(index / 4),
          index,
        })}
      />

      {/* Status Change Modal */}
      <StatusModal
        isVisible={isStatusModalOpen}
        propertyName={propertyData?.name || ""}
        units={unitsData?.units || []}
        selectedUnitId={selectedUnit?.id}
        onClose={closeStatusModal}
        onConfirm={handleStatusChange}
      />

      {/* Bottom Bar - Blue bar covering tab bar area */}
      <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-40">
        <View className="h-[1px] bg-black" />
      </View>
    </ImageBackground>
  );
}
