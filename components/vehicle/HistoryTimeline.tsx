/**
 * HistoryTimeline Component
 * 
 * Chronological event display with icons and timestamps
 * Uses NativeWind for styling
 */

import type { VehicleHistoryEvent } from "@/modules/vehicle";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";

interface HistoryTimelineProps {
  events: VehicleHistoryEvent[];
}

const getEventIcon = (eventType: VehicleHistoryEvent["eventType"]): keyof typeof Ionicons.glyphMap => {
  switch (eventType) {
    case "created":
      return "add-circle-outline";
    case "status_changed":
      return "swap-horizontal-outline";
    case "document_updated":
      return "document-text-outline";
    case "photo_added":
      return "camera-outline";
    case "photo_removed":
      return "trash-outline";
    case "assigned_to_booking":
      return "calendar-outline";
    case "unassigned_from_booking":
      return "calendar-clear-outline";
    case "set_active":
      return "checkmark-circle-outline";
    case "set_inactive":
      return "close-circle-outline";
    default:
      return "information-circle-outline";
  }
};

const getEventColor = (eventType: VehicleHistoryEvent["eventType"]): string => {
  switch (eventType) {
    case "created":
      return "#22C55E"; // success
    case "status_changed":
      return "#20A6FD"; // primary
    case "document_updated":
      return "#F59E0B"; // warning
    case "photo_added":
      return "#20A6FD"; // primary
    case "photo_removed":
      return "#F75555"; // danger
    case "assigned_to_booking":
      return "#22C55E"; // success
    case "unassigned_from_booking":
      return "#BDBDC0"; // light
    case "set_active":
      return "#22C55E"; // success
    case "set_inactive":
      return "#BDBDC0"; // light
    default:
      return "#4F5C62"; // dark-100
  }
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export function HistoryTimeline({ events }: HistoryTimelineProps) {
  if (events.length === 0) {
    return (
      <View className="items-center justify-center py-8">
        <Ionicons name="time-outline" size={48} color="#BDBDC0" />
        <Text className="font-inter text-[15px] text-dark-100 mt-2">
          No history yet
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const icon = getEventIcon(event.eventType);
        const color = getEventColor(event.eventType);

        return (
          <View key={event.id} className="flex-row">
            {/* Timeline Line */}
            <View className="items-center mr-3">
              {/* Icon Circle */}
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Ionicons name={icon} size={20} color={color} />
              </View>
              {/* Vertical Line */}
              {!isLast && (
                <View className="w-0.5 flex-1 bg-light-200 mt-1" />
              )}
            </View>

            {/* Event Content */}
            <View className={`flex-1 ${!isLast ? "pb-4" : ""}`}>
              {/* Description */}
              <Text className="font-inter-medium text-[15px] text-dark-400">
                {event.description}
              </Text>

              {/* Metadata */}
              {event.metadata && Object.keys(event.metadata).length > 0 && (
                <View className="mt-1">
                  {Object.entries(event.metadata).map(([key, value]) => (
                    <Text key={key} className="font-inter text-[13px] text-dark-100">
                      {key}: {String(value)}
                    </Text>
                  ))}
                </View>
              )}

              {/* Performer and Timestamp */}
              <View className="flex-row items-center mt-1">
                <Ionicons name="person-circle-outline" size={14} color="#4F5C62" />
                <Text className="font-inter text-[13px] text-dark-100 ml-1">
                  {event.performedBy}
                </Text>
                <Text className="font-inter text-[13px] text-dark-100 mx-1">•</Text>
                <Text className="font-inter text-[13px] text-dark-100">
                  {formatTimestamp(event.timestamp)}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
