/**
 * MapSearchBar Component
 * 
 * Search bar overlay for the map
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface MapSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  top?: number;
}

export function MapSearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = "Search location...",
  top,
}: MapSearchBarProps) {
  return (
    <View style={[styles.container, top !== undefined ? { top } : undefined]}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#545454" style={styles.icon} />
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#BDBDC0"
        />

        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#BDBDC0" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: "#000000",
  },
  clearButton: {
    padding: 4,
  },
});
