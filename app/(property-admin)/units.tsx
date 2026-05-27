import {
  EmptyState,
  GradientHeader,
  PropertyCard,
  RoomCard,
  SkeletonLoader,
  StatusModal,
} from "@/components/property-admin";
import {
  useProperties,
  usePropertyAdminStore,
  usePropertyUnits,
  useUpdateUnitStatus,
} from "@/modules/property-admin";
import type { Property } from "@/modules/property-admin/types";
import React from "react";
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

const ownerId = "owner-001";

export default function AllUnitsScreen() {
  const {
    isStatusModalOpen,
    openStatusModal,
    closeStatusModal,
    selectedUnit,
    setSelectedUnit,
  } = usePropertyAdminStore();

  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    error: propertiesError,
    refetch: refetchProperties,
  } = useProperties({ page: 1, pageSize: 20 });

  const properties = propertiesData?.properties ?? [];
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<string>("");

  React.useEffect(() => {
    if (!selectedPropertyId && properties.length > 0) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId]);

  const selectedProperty = React.useMemo(
    () => properties.find((property) => property.id === selectedPropertyId),
    [properties, selectedPropertyId]
  );

  const {
    data: unitsData,
    isLoading: unitsLoading,
    error: unitsError,
    refetch: refetchUnits,
  } = usePropertyUnits(selectedPropertyId, { enabled: !!selectedPropertyId });

  const updateUnitStatus = useUpdateUnitStatus();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchProperties(), selectedPropertyId ? refetchUnits() : Promise.resolve()]);
    setRefreshing(false);
  }, [refetchProperties, refetchUnits, selectedPropertyId]);

  const handleUnitPress = React.useCallback(
    (unitId: string) => {
      const unit = unitsData?.units.find((candidate) => candidate.id === unitId);
      if (unit) {
        setSelectedUnit(unit);
        openStatusModal();
      }
    },
    [openStatusModal, setSelectedUnit, unitsData]
  );

  const handleStatusChange = React.useCallback(
    (unitId: string, newStatus: any) => {
      updateUnitStatus.mutate(
        {
          unitId,
          newStatus,
          updatedBy: ownerId,
        },
        {
          onSuccess: closeStatusModal,
          onError: (error) => {
            console.error("Failed to update status:", error);
          },
        }
      );
    },
    [closeStatusModal, updateUnitStatus]
  );

  const propertyHeaderData = React.useMemo(() => {
    if (!selectedProperty) return null;

    const units = unitsData?.units ?? [];
    const occupiedUnits = units.filter((unit) => unit.status === "occupied").length;
    const totalUnits = selectedProperty.totalUnits;

    return {
      icon: require("@/assets/icons/house-icon.webp"),
      title: selectedProperty.name,
      location: `${selectedProperty.location.estate}, ${selectedProperty.location.county}`,
      totalRooms: totalUnits,
      pricePerMonth: selectedProperty.pricePerUnit,
      monthlyRentals:
        units.length > 0
          ? units
              .filter((unit) => unit.status === "occupied")
              .reduce((sum, unit) => sum + unit.price, 0)
          : selectedProperty.monthlyRentals,
      occupancyRatio: `${occupiedUnits || selectedProperty.occupiedUnits}/${totalUnits}`,
    };
  }, [selectedProperty, unitsData]);

  const renderProperty = ({ item }: { item: Property }) => (
    <View
      style={{ opacity: item.id === selectedPropertyId ? 1 : 0.62 }}
    >
      <PropertyCard property={item} onPress={setSelectedPropertyId} />
    </View>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/app-full-screen.webp")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="absolute top-0 left-0 right-0 h-[3.5%] bg-[#20A6FD] z-50" />

      {propertyHeaderData ? (
        <GradientHeader
          variant="units"
          propertyData={propertyHeaderData}
          onSearchPress={() => {}}
          onSwitchProperty={() => {}}
        />
      ) : (
        <View className="h-[18vh] bg-[#20A6FD]" />
      )}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#20A6FD"
          />
        }
        contentContainerStyle={{ paddingBottom: 132 }}
      >
        <View className="px-5 pt-5 pb-3">
          <Text className="text-[18px] font-inter-semibold text-black">
            Select Property
          </Text>
          <Text className="text-[13px] font-inter text-[#545454]">
            Units update based on the selected property.
          </Text>
        </View>

        {propertiesLoading ? (
          <SkeletonLoader variant="property-cards" />
        ) : propertiesError ? (
          <View className="px-5">
            <View className="p-4 bg-red-50 rounded-lg">
              <Text className="text-red-600 text-center">
                Failed to load properties
              </Text>
            </View>
          </View>
        ) : properties.length === 0 ? (
          <EmptyState variant="no-properties" onActionPress={() => {}} />
        ) : (
          <FlatList
            data={properties}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={renderProperty}
            keyExtractor={(item) => item.id}
          />
        )}

        <View className="px-5 pt-5 pb-3">
          <Text className="text-[18px] font-inter-semibold text-black">
            {selectedProperty?.name ? `${selectedProperty.name} Units` : "Units"}
          </Text>
        </View>

        {unitsLoading ? (
          <View className="px-5">
            <SkeletonLoader variant="unit-grid" />
          </View>
        ) : unitsError ? (
          <View className="px-5">
            <View className="p-4 bg-red-50 rounded-lg">
              <Text className="text-red-600 text-center">
                Failed to load units
              </Text>
            </View>
          </View>
        ) : !unitsData || unitsData.units.length === 0 ? (
          <EmptyState variant="no-units" onActionPress={() => {}} />
        ) : (
          <FlatList
            data={unitsData.units}
            numColumns={4}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={{ width: "25%" }}>
                <RoomCard unit={item} onPress={handleUnitPress} />
              </View>
            )}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          />
        )}
      </ScrollView>

      <StatusModal
        isVisible={isStatusModalOpen}
        propertyName={selectedProperty?.name || ""}
        units={unitsData?.units || []}
        selectedUnitId={selectedUnit?.id}
        onClose={closeStatusModal}
        onConfirm={handleStatusChange}
      />

      <View
        pointerEvents="none"
        className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#20A6FD] z-40"
      >
        <View className="h-[1px] bg-black" />
      </View>
    </ImageBackground>
  );
}
