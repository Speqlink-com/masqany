/**
 * StatusModal Component
 * 
 * Modal for changing unit status with searchable unit dropdown and status cards.
 * 
 * Features:
 * - White background with rounded corners and shadow
 * - Property name as title
 * - Searchable unit dropdown
 * - 3 status cards: Occupied, Soon Vacant, Vacant
 * - Single selection (radio button behavior)
 * - Selected card: #28b4f9 background, white text
 * - Unselected cards: #f3f4f3 background, dark text
 * - Cancel and Confirm buttons
 * - Dismissible by tapping outside
 */

import { colors, spacing, typography } from "@/constants/tokens";
import { Unit, UnitStatus } from "@/modules/property-admin/types";
import { Image } from "expo-image";
import React from "react";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface StatusModalProps {
  isVisible: boolean;
  propertyName: string;
  units: Unit[];
  selectedUnitId?: string;
  onClose: () => void;
  onConfirm: (unitId: string, newStatus: UnitStatus) => void;
}

export default function StatusModal({
  isVisible,
  propertyName,
  units,
  selectedUnitId,
  onClose,
  onConfirm,
}: StatusModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState<Unit | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<UnitStatus | null>(
    null
  );

  // Initialize selected unit when modal opens
  React.useEffect(() => {
    if (isVisible && selectedUnitId) {
      const unit = units.find((u) => u.id === selectedUnitId);
      if (unit) {
        setSelectedUnit(unit);
        setSelectedStatus(unit.status);
      }
    }
  }, [isVisible, selectedUnitId, units]);

  // Filter units based on search query
  const filteredUnits = React.useMemo(() => {
    if (!searchQuery.trim()) return units;
    const query = searchQuery.toLowerCase();
    return units.filter((unit) =>
      unit.roomNumber.toLowerCase().includes(query)
    );
  }, [units, searchQuery]);

  // Handle unit selection from dropdown
  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    setSelectedStatus(unit.status);
    setShowDropdown(false);
    setSearchQuery("");
  };

  // Handle status card selection
  const handleStatusSelect = (status: UnitStatus) => {
    setSelectedStatus(status);
  };

  // Handle confirm button
  const handleConfirm = () => {
    if (selectedUnit && selectedStatus) {
      onConfirm(selectedUnit.id, selectedStatus);
      handleClose();
    }
  };

  // Handle close/cancel
  const handleClose = () => {
    setSearchQuery("");
    setShowDropdown(false);
    setSelectedUnit(null);
    setSelectedStatus(null);
    onClose();
  };

  // Status card data
  const statusCards = [
    {
      status: "occupied" as UnitStatus,
      label: "Occupied",
      icon: require("@/assets/icons/occupied-prop-icon.png"),
    },
    {
      status: "vacant_soon" as UnitStatus,
      label: "Soon Vacant",
      icon: require("@/assets/icons/vaccant-prop-icon.webp"),
    },
    {
      status: "vacant" as UnitStatus,
      label: "Vacant",
      icon: require("@/assets/icons/vaccant-prop-icon.webp"),
    },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        className="flex-1 bg-black/50 items-center justify-center px-5"
      >
        {/* Modal Content */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-md"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View className="p-6">
            {/* Title */}
            <Text
              style={{
                fontFamily: typography.family.headingSemiBold,
                fontSize: 18,
                color: colors.dark[900],
                marginBottom: spacing.md,
                textAlign: "center",
              }}
            >
              {propertyName}
            </Text>

            {/* Unit Dropdown */}
            <View className="mb-4">
              <Text
                style={{
                  fontFamily: typography.family.medium,
                  fontSize: 14,
                  color: colors.dark[700],
                  marginBottom: spacing.xs,
                }}
              >
                Select Unit
              </Text>

              {/* Dropdown Input */}
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                className="border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between"
              >
                <Text
                  style={{
                    fontFamily: typography.family.regular,
                    fontSize: 15,
                    color: selectedUnit ? colors.dark[900] : colors.dark[400],
                  }}
                >
                  {selectedUnit ? selectedUnit.roomNumber : "Choose a unit"}
                </Text>
                <Image
                  source={require("@/assets/icons/arrow-dropdown.png")}
                  style={{
                    width: 16,
                    height: 16,
                    tintColor: colors.dark[400],
                    transform: [{ rotate: showDropdown ? "180deg" : "0deg" }],
                  }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  placeholder={require("@/assets/icons/arrow-dropdown.png")}
                  transition={200}
                />
              </TouchableOpacity>

              {/* Dropdown List */}
              {showDropdown && (
                <View className="mt-2 border border-gray-300 rounded-xl overflow-hidden max-h-48">
                  {/* Search Input */}
                  <View className="border-b border-gray-200 px-4 py-2">
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search units..."
                      placeholderTextColor={colors.dark[400]}
                      style={{
                        fontFamily: typography.family.regular,
                        fontSize: 14,
                        color: colors.dark[900],
                      }}
                    />
                  </View>

                  {/* Units List */}
                  <ScrollView className="max-h-40">
                    {filteredUnits.map((unit) => (
                      <TouchableOpacity
                        key={unit.id}
                        onPress={() => handleUnitSelect(unit)}
                        className="px-4 py-3 border-b border-gray-100"
                      >
                        <Text
                          style={{
                            fontFamily: typography.family.regular,
                            fontSize: 14,
                            color: colors.dark[900],
                          }}
                        >
                          {unit.roomNumber}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {filteredUnits.length === 0 && (
                      <View className="px-4 py-6">
                        <Text
                          style={{
                            fontFamily: typography.family.regular,
                            fontSize: 14,
                            color: colors.dark[400],
                            textAlign: "center",
                          }}
                        >
                          No units found
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Status Cards */}
            <View className="mb-6">
              <Text
                style={{
                  fontFamily: typography.family.medium,
                  fontSize: 14,
                  color: colors.dark[700],
                  marginBottom: spacing.sm,
                }}
              >
                Select Status
              </Text>

              <View className="gap-3">
                {statusCards.map((card) => {
                  const isSelected = selectedStatus === card.status;
                  return (
                    <TouchableOpacity
                      key={card.status}
                      onPress={() => handleStatusSelect(card.status)}
                      className="rounded-xl p-4 flex-row items-center"
                      style={{
                        backgroundColor: isSelected ? "#28b4f9" : "#f3f4f3",
                      }}
                    >
                      <Image
                        source={card.icon}
                        style={{
                          width: 32,
                          height: 32,
                          tintColor: isSelected
                            ? colors.light[400]
                            : colors.dark[700],
                          marginRight: spacing.sm,
                        }}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                        placeholder={card.icon}
                        transition={200}
                      />
                      <Text
                        style={{
                          fontFamily: typography.family.semibold,
                          fontSize: 16,
                          color: isSelected
                            ? colors.light[400]
                            : colors.dark[900],
                        }}
                      >
                        {card.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              {/* Cancel Button */}
              <TouchableOpacity
                onPress={handleClose}
                className="flex-1 bg-gray-200 rounded-full py-3"
              >
                <Text
                  style={{
                    fontFamily: typography.family.semibold,
                    fontSize: 15,
                    color: colors.dark[700],
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* Confirm Button */}
              <TouchableOpacity
                onPress={handleConfirm}
                disabled={!selectedUnit || !selectedStatus}
                className="flex-1 rounded-full py-3"
                style={{
                  backgroundColor:
                    selectedUnit && selectedStatus ? "#28b4f9" : "#d1d5db",
                }}
              >
                <Text
                  style={{
                    fontFamily: typography.family.semibold,
                    fontSize: 15,
                    color: colors.light[400],
                    textAlign: "center",
                  }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
