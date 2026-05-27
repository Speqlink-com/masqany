import { BackButton } from "@/components/auth/BackButton";
import { mockVideoFeedData } from "@/assets/data/video-feed";
import type { PriceUnit, PropertyType, PropertyVideo } from "@/modules/video-feed/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const THEME_BLUE = "#3fbdfd";
const CARD_BG = "#e1e6e8";

const resultImages = [
  require("@/assets/prop-images/image2.jpeg"),
  require("@/assets/prop-images/image3.jpeg"),
  require("@/assets/prop-images/image4.jpeg"),
  require("@/assets/prop-images/image5.jpeg"),
  require("@/assets/prop-images/image6.jpeg"),
];

const propertyTypes: (PropertyType | "all")[] = [
  "all",
  "bedsitter",
  "1BR",
  "2BR",
  "3BR",
  "airbnb",
  "hotel",
  "vacation",
];

const priceRanges = [
  { label: "Any", min: undefined, max: undefined },
  { label: "0-20k", min: 0, max: 20000 },
  { label: "20k-60k", min: 20000, max: 60000 },
  { label: "60k+", min: 60000, max: undefined },
];

function formatPrice(price: number, unit: PriceUnit) {
  return `KES ${price.toLocaleString("en-KE")} / ${unit}`;
}

function statusMeta(status: PropertyVideo["unitStatus"]) {
  if (status === "soon_vacant") {
    return {
      icon: require("@/assets/icons/coming-soon.webp"),
    };
  }

  return {
    icon: require("@/assets/icons/available-now.webp"),
  };
}

function previewImageFor(index: number): ImageSourcePropType {
  return resultImages[index % resultImages.length];
}

interface ResultCardProps {
  item: PropertyVideo;
  index: number;
  onPress: (videoId: string) => void;
}

function ResultCard({ item, index, onPress }: ResultCardProps) {
  const status = statusMeta(item.unitStatus);

  return (
    <Pressable
      onPress={() => onPress(item.id)}
      style={[styles.resultCard, { height: Math.max(226, (SCREEN_HEIGHT - 245) / 2) }]}
    >
      <Image source={previewImageFor(index)} style={styles.resultImage} resizeMode="cover" />

      <View style={styles.infoCard}>
        <View style={styles.metaRow}>
          <Image
            source={require("@/assets/icons/house-icon.webp")}
            style={styles.metaIcon}
            resizeMode="contain"
          />
          <Text style={styles.typeText} numberOfLines={1}>
            {item.propertyType}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Image
            source={require("@/assets/icons/i-payment-icon.webp")}
            style={styles.metaIcon}
            resizeMode="contain"
          />
          <Text style={styles.metaText} numberOfLines={1}>
            {formatPrice(item.price, item.priceUnit)}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Image
            source={require("@/assets/icons/i-location-icon.webp")}
            style={styles.metaIcon}
            resizeMode="contain"
          />
          <Text style={styles.metaText} numberOfLines={1}>
            {item.location.estate}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Image source={status.icon} style={styles.statusIcon} resizeMode="contain" />
        </View>
      </View>
    </Pressable>
  );
}

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ openFilters?: string }>();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(params.openFilters === "1");
  const [selectedType, setSelectedType] = useState<PropertyType | "all">("all");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

  const availableLocations = useMemo(() => {
    const locations = mockVideoFeedData
      .filter((item) => item.unitStatus !== "occupied")
      .map((item) => item.location.estate);
    return ["All", ...Array.from(new Set(locations))];
  }, []);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const priceRange = priceRanges[selectedPriceIndex];

    return mockVideoFeedData.filter((item) => {
      if (item.unitStatus === "occupied") return false;
      if (selectedType !== "all" && item.propertyType !== selectedType) return false;
      if (selectedLocation !== "All" && item.location.estate !== selectedLocation) return false;
      if (priceRange.min !== undefined && item.price < priceRange.min) return false;
      if (priceRange.max !== undefined && item.price > priceRange.max) return false;
      if (!normalizedQuery) return true;

      const searchable = [
        item.title,
        item.description,
        item.propertyType,
        item.location.estate,
        item.location.county,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [query, selectedLocation, selectedPriceIndex, selectedType]);

  const openVideo = (videoId: string) => {
    router.push({
      pathname: "/(tabs)/home",
      params: { videoId },
    } as never);
  };

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedLocation("All");
    setSelectedPriceIndex(0);
    setQuery("");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/app-full-screen.webp")}
      style={styles.screen}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <View style={styles.topBlueBar} />
      <View pointerEvents="none" style={styles.bottomBlueBar}>
        <View style={styles.bottomDivider} />
      </View>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Search</Text>
            <Text style={styles.headerSubtitle}>{results.length} homes ready to view</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters((value) => !value)}
            activeOpacity={0.78}
            style={styles.headerFilterButton}
          >
            <Image
              source={require("@/assets/icons/filter.png")}
              style={styles.headerFilterIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchShell}>
          <Ionicons name="search" size={18} color="#111" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search location, type, price..."
            placeholderTextColor="rgba(0,0,0,0.45)"
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery("")} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={19} color="rgba(0,0,0,0.45)" />
            </TouchableOpacity>
          ) : null}
        </View>

        {showFilters ? (
          <View style={styles.filterCard}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter properties</Text>
              <TouchableOpacity onPress={clearFilters} activeOpacity={0.72}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterLabel}>Type</Text>
            <View style={styles.chipWrap}>
              {propertyTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedType(type)}
                  activeOpacity={0.75}
                  style={[styles.chip, selectedType === type && styles.activeChip]}
                >
                  <Text style={[styles.chipText, selectedType === type && styles.activeChipText]}>
                    {type === "all" ? "All" : type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Price range</Text>
            <View style={styles.chipWrap}>
              {priceRanges.map((range, index) => (
                <TouchableOpacity
                  key={range.label}
                  onPress={() => setSelectedPriceIndex(index)}
                  activeOpacity={0.75}
                  style={[styles.chip, selectedPriceIndex === index && styles.activeChip]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedPriceIndex === index && styles.activeChipText,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Location</Text>
            <FlatList
              horizontal
              data={availableLocations}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.locationList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedLocation(item)}
                  activeOpacity={0.75}
                  style={[styles.chip, selectedLocation === item && styles.activeChip]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedLocation === item && styles.activeChipText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : null}

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item, index }) => (
            <ResultCard item={item} index={index} onPress={openVideo} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No matching property</Text>
              <Text style={styles.emptyText}>Try a different location, type, or price range.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topBlueBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3.5%",
    backgroundColor: THEME_BLUE,
    zIndex: 2,
  },
  bottomBlueBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: THEME_BLUE,
    zIndex: 2,
  },
  bottomDivider: {
    height: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginTop: -2,
  },
  headerFilterButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME_BLUE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 9,
    elevation: 7,
  },
  headerFilterIcon: {
    width: 18,
    height: 18,
    tintColor: "#FFFFFF",
  },
  searchShell: {
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: "rgba(225,230,232,0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 7,
  },
  searchInput: {
    flex: 1,
    color: "#000",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  filterCard: {
    backgroundColor: "rgba(225,230,232,0.96)",
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 9,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterTitle: {
    color: "#000",
    fontSize: 15,
    fontFamily: "Poppins_700Bold",
  },
  clearText: {
    color: THEME_BLUE,
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  filterLabel: {
    color: "rgba(0,0,0,0.62)",
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    marginTop: 10,
    marginBottom: 7,
    textTransform: "uppercase",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  locationList: {
    gap: 8,
    paddingRight: 12,
  },
  chip: {
    minHeight: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  activeChip: {
    backgroundColor: THEME_BLUE,
    borderColor: THEME_BLUE,
  },
  chipText: {
    color: "#000",
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  activeChipText: {
    color: "#FFFFFF",
  },
  resultsList: {
    paddingBottom: 120,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  resultCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#111",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 13,
    elevation: 8,
  },
  resultImage: {
    width: "100%",
    height: "100%",
  },
  infoCard: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: "48%",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: CARD_BG,
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 9,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.68)",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    minHeight: 22,
  },
  metaIcon: {
    width: 15,
    height: 15,
  },
  typeText: {
    flex: 1,
    color: "#000",
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    textTransform: "capitalize",
  },
  metaText: {
    flex: 1,
    color: "rgba(0,0,0,0.78)",
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  statusRow: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    minHeight: 30,
    marginTop: 4,
  },
  statusIcon: {
    width: 112,
    height: 26,
  },
  emptyState: {
    marginTop: 56,
    alignItems: "center",
    backgroundColor: "rgba(225,230,232,0.94)",
    borderRadius: 22,
    padding: 20,
  },
  emptyTitle: {
    color: "#000",
    fontSize: 17,
    fontFamily: "Poppins_700Bold",
  },
  emptyText: {
    color: "rgba(0,0,0,0.62)",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    marginTop: 4,
  },
});
