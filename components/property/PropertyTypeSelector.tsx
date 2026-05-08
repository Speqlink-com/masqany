/**
 * PropertyTypeSelector Component
 * 
 * Dropdown selector for property types
 * Supports both Long-Stay and Short-Stay property types
 */

import { colors, shadow } from "@/constants/tokens";
import type { LongStayPropertyType, ShortStayPropertyType } from "@/modules/property";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface PropertyTypeSelectorProps {
  value: LongStayPropertyType | ShortStayPropertyType | null;
  onChange: (value: LongStayPropertyType | ShortStayPropertyType) => void;
  stayType: "long_stay" | "short_stay";
  placeholder?: string;
}

const LONG_STAY_TYPES: { value: LongStayPropertyType; label: string }[] = [
  { value: "single_room", label: "Single Room" },
  { value: "bedsitter", label: "Bedsitter" },
  { value: "1_bedroom", label: "1 Bedroom" },
  { value: "2_bedroom", label: "2 Bedroom" },
  { value: "3_bedroom", label: "3 Bedroom" },
  { value: "4plus_bedroom", label: "4+ Bedroom" },
  { value: "hostel_bed_space", label: "Hostel Bed Space" },
  { value: "hostel_private_room", label: "Hostel Private Room" },
  { value: "student_hostel", label: "Student Hostel" },
  { value: "office_space", label: "Office Space" },
  { value: "shop_retail", label: "Shop/Retail" },
  { value: "warehouse", label: "Warehouse" },
  { value: "mixed_use", label: "Mixed Use" },
];

const SHORT_STAY_TYPES: { value: ShortStayPropertyType; label: string }[] = [
  { value: "hotel_room_standard", label: "Hotel Room (Standard)" },
  { value: "hotel_suite", label: "Hotel Suite" },
  { value: "boutique_hotel", label: "Boutique Hotel" },
  { value: "budget_hotel", label: "Budget Hotel" },
  { value: "lodge_room", label: "Lodge Room" },
  { value: "guest_house", label: "Guest House" },
  { value: "bnb_room", label: "B&B Room" },
  { value: "vacation_home", label: "Vacation Home" },
  { value: "vacation_apartment", label: "Vacation Apartment" },
  { value: "private_room", label: "Private Room" },
  { value: "shared_room", label: "Shared Room" },
  { value: "serviced_apartment", label: "Serviced Apartment" },
  { value: "cottage", label: "Cottage" },
  { value: "villa", label: "Villa" },
  { value: "cabin", label: "Cabin" },
  { value: "airbnb_entire", label: "Airbnb (Entire Place)" },
  { value: "airbnb_private", label: "Airbnb (Private Room)" },
];

export function PropertyTypeSelector({
  value,
  onChange,
  stayType,
  placeholder = "Select Property Type",
}: PropertyTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options = stayType === "long_stay" ? LONG_STAY_TYPES : SHORT_STAY_TYPES;
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="flex-row items-center justify-between px-4 py-3 rounded-lg"
        style={{
          backgroundColor: colors.light[400],
          borderWidth: 1,
          borderColor: value ? colors.primary[700] : colors.light[200],
          ...shadow.sm,
        }}
        activeOpacity={0.7}
      >
        <Text
          className="font-inter text-[15px]"
          style={{
            color: value ? colors.dark[400] : colors.dark[100],
          }}
        >
          {selectedLabel || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.dark[100]}
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            className="w-[90%] max-h-[70%] rounded-lg p-4"
            style={{ backgroundColor: colors.light[400] }}
            onStartShouldSetResponder={() => true}
          >
            <Text className="font-poppins-semibold text-[17px] text-dark-400 mb-4">
              Select Property Type
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="py-3 px-4 rounded-lg mb-2"
                  style={{
                    backgroundColor:
                      value === option.value
                        ? colors.primary[50]
                        : "transparent",
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className="font-inter text-[15px]"
                    style={{
                      color:
                        value === option.value
                          ? colors.primary[700]
                          : colors.dark[400],
                      fontWeight: value === option.value ? "600" : "400",
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              className="mt-4 py-3 rounded-lg items-center"
              style={{ backgroundColor: colors.light[300] }}
              activeOpacity={0.7}
            >
              <Text className="font-inter-medium text-[15px] text-dark-400">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
