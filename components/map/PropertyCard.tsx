/**
 * PropertyCard Component
 * 
 * Displays property information in a card format
 */

import { MockProperty } from "@/constants/mockProperties";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PropertyCardProps {
  property: MockProperty;
  onPress?: () => void;
}

export function PropertyCard({ property, onPress }: PropertyCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Vacancy Badge */}
      <View style={[styles.badge, property.vacant ? styles.badgeVacant : styles.badgeOccupied]}>
        <Text style={styles.badgeText}>
          {property.vacant ? "Vacant" : "Occupied"}
        </Text>
      </View>

      {/* Property Info */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#545454" />
          <Text style={styles.location}>{property.location}</Text>
        </View>

        <View style={styles.detailsRow}>
          {property.bedrooms && (
            <View style={styles.detail}>
              <Ionicons name="bed-outline" size={14} color="#545454" />
              <Text style={styles.detailText}>{property.bedrooms} BR</Text>
            </View>
          )}
          {property.bathrooms && (
            <View style={styles.detail}>
              <Ionicons name="water-outline" size={14} color="#545454" />
              <Text style={styles.detailText}>{property.bathrooms} BA</Text>
            </View>
          )}
          {property.area && (
            <View style={styles.detail}>
              <Ionicons name="resize-outline" size={14} color="#545454" />
              <Text style={styles.detailText}>{property.area} m²</Text>
            </View>
          )}
        </View>

        <Text style={styles.price}>
          KES {property.price.toLocaleString()}/mo
        </Text>
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={20} color="#BDBDC0" style={styles.arrow} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeVacant: {
    backgroundColor: "#22C55E",
  },
  badgeOccupied: {
    backgroundColor: "#F75555",
  },
  badgeText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 11,
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: "CG-SemiBold",
    fontSize: 16,
    color: "#000000",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: "#545454",
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: "#545454",
  },
  price: {
    fontFamily: "CG-Bold",
    fontSize: 18,
    color: "#20A6FD",
  },
  arrow: {
    marginLeft: 8,
  },
});
