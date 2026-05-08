/**
 * AvailabilityCalendar Component
 * 
 * Interactive calendar for marking dates as available/booked
 * For Short-Stay properties
 */

import { colors } from "@/constants/tokens";
import type { AvailabilityDate } from "@/modules/property";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AvailabilityCalendarProps {
  availabilityDates: AvailabilityDate[];
  onChange: (dates: AvailabilityDate[]) => void;
}

export function AvailabilityCalendar({
  availabilityDates,
  onChange,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const toggleDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const existingIndex = availabilityDates.findIndex((d) => d.date === dateStr);

    if (existingIndex >= 0) {
      // Toggle availability
      const updated = [...availabilityDates];
      updated[existingIndex] = {
        ...updated[existingIndex],
        available: !updated[existingIndex].available,
      };
      onChange(updated);
    } else {
      // Add new date as available
      onChange([...availabilityDates, { date: dateStr, available: true }]);
    }
  };

  const isDateAvailable = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const dateObj = availabilityDates.find((d) => d.date === dateStr);
    return dateObj?.available ?? true; // Default to available
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <View className="mb-4">
      <Text className="font-poppins-semibold text-[15px] text-dark-400 mb-3">
        Availability Calendar
      </Text>

      <View
        className="p-4 rounded-lg"
        style={{ backgroundColor: "#E1E6E8" }}
      >
        {/* Month Navigation */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={previousMonth}
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.light[400] }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={colors.dark[400]} />
          </TouchableOpacity>

          <Text className="font-poppins-semibold text-[15px] text-dark-400">
            {monthName}
          </Text>

          <TouchableOpacity
            onPress={nextMonth}
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.light[400] }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={20} color={colors.dark[400]} />
          </TouchableOpacity>
        </View>

        {/* Day Headers */}
        <View className="flex-row mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="font-inter-semibold text-[11px] text-dark-100">
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View>
          {Array.from({ length: Math.ceil((daysInMonth + startingDayOfWeek) / 7) }).map(
            (_, weekIndex) => (
              <View key={weekIndex} className="flex-row mb-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const dayNumber =
                    weekIndex * 7 + dayIndex - startingDayOfWeek + 1;
                  const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                  const isAvailable = isValidDay && isDateAvailable(dayNumber);

                  return (
                    <View key={dayIndex} className="flex-1 items-center p-1">
                      {isValidDay ? (
                        <TouchableOpacity
                          onPress={() => toggleDate(dayNumber)}
                          className="w-8 h-8 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: isAvailable
                              ? colors.success
                              : colors.danger,
                          }}
                          activeOpacity={0.7}
                        >
                          <Text className="font-inter text-[11px] text-white">
                            {dayNumber}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View className="w-8 h-8" />
                      )}
                    </View>
                  );
                })}
              </View>
            )
          )}
        </View>

        {/* Legend */}
        <View className="flex-row items-center justify-center mt-4 gap-4">
          <View className="flex-row items-center">
            <View
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: colors.success }}
            />
            <Text className="font-inter text-[11px] text-dark-100">
              Available
            </Text>
          </View>
          <View className="flex-row items-center">
            <View
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: colors.danger }}
            />
            <Text className="font-inter text-[11px] text-dark-100">Booked</Text>
          </View>
        </View>
      </View>

      <Text className="font-inter text-[11px] text-dark-100 mt-2">
        Tap dates to toggle availability
      </Text>
    </View>
  );
}
