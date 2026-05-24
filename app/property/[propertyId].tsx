import { mockVideoFeedData } from "@/assets/data/video-feed";
import icons from "@/constants/icons";
import { mockProperties } from "@/constants/mockProperties";
import { colors, spacing, typography } from "@/constants/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type React from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900";

function getProperty(propertyId: string) {
  const videoProperty = mockVideoFeedData.find((property) => property.id === propertyId);
  if (videoProperty) {
    return {
      id: videoProperty.id,
      title: videoProperty.title,
      description: videoProperty.description,
      image: videoProperty.thumbnailUrl,
      price: videoProperty.price,
      priceUnit: videoProperty.priceUnit,
      location: `${videoProperty.location.estate}, ${videoProperty.location.county}`,
      bedrooms: videoProperty.bedrooms,
      bathrooms: videoProperty.bathrooms,
      size: videoProperty.size,
      amenities: videoProperty.amenities,
      agentName: videoProperty.owner.name,
      agentAvatar: videoProperty.owner.avatar,
      isVerified: videoProperty.owner.isVerified,
    };
  }

  const moveProperty = mockProperties.find((property) => String(property.id) === propertyId);
  if (moveProperty) {
    return {
      id: String(moveProperty.id),
      title: moveProperty.title,
      description:
        "A nearby Masqany listing selected from the Move map. Full images and backend details will be attached when property APIs are ready.",
      image: FALLBACK_IMAGE,
      price: moveProperty.price,
      priceUnit: "month",
      location: moveProperty.location,
      bedrooms: moveProperty.bedrooms ?? 1,
      bathrooms: moveProperty.bathrooms ?? 1,
      size: moveProperty.area,
      amenities: ["Water", "Security", "Parking"],
      agentName: "Masqany Agent",
      agentAvatar: "https://i.pravatar.cc/150?img=18",
      isVerified: true,
    };
  }

  return null;
}

export default function PropertyListingScreen() {
  const router = useRouter();
  const { propertyId, focus } = useLocalSearchParams<{
    propertyId: string;
    focus?: string;
  }>();
  const property = getProperty(String(propertyId));
  const paymentFocused = focus === "payment";

  if (!property) {
    return (
      <SafeAreaView style={styles.root}>
        <StatusBar style="dark" />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={icons.backArrow} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.emptyState}>
          <Text style={styles.title}>Listing unavailable</Text>
          <Text style={styles.mutedText}>This property could not be found locally.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: property.image }} style={styles.heroImage} resizeMode="cover" />
          <TouchableOpacity style={styles.heroBackButton} onPress={() => router.back()}>
            <Image source={icons.backArrow} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCard}>
          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.locationRow}>
            <Image source={icons.location} style={styles.inlineIcon} resizeMode="contain" />
            <Text style={styles.mutedText}>{property.location}</Text>
          </View>
          <Text style={styles.price}>
            KES {property.price.toLocaleString()}/{property.priceUnit}
          </Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        <View style={styles.summaryRow}>
          <InfoPill icon={icons.bed} label={`${property.bedrooms} beds`} />
          <InfoPill icon={icons.bath} label={`${property.bathrooms} baths`} />
          <InfoPill icon={icons.area} label={`${property.size ?? 0} sqft`} />
        </View>

        <Section title="Agent details">
          <View style={styles.agentRow}>
            <Image source={{ uri: property.agentAvatar }} style={styles.agentAvatar} />
            <View style={styles.agentCopy}>
              <Text style={styles.agentName}>{property.agentName}</Text>
              <Text style={styles.mutedText}>
                {property.isVerified ? "Verified Masqany partner" : "Masqany partner"}
              </Text>
            </View>
            <Image source={icons.chat} style={styles.actionIcon} resizeMode="contain" />
          </View>
        </Section>

        <Section title="Amenities available">
          <View style={styles.amenitiesGrid}>
            {property.amenities.map((amenity) => (
              <View key={amenity} style={styles.amenityPill}>
                <Image source={icons.success} style={styles.amenityIcon} resizeMode="contain" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Policies">
          <Text style={styles.bodyText}>Viewing requires agent confirmation.</Text>
          <Text style={styles.bodyText}>Tenant must complete identity verification before booking.</Text>
          <Text style={styles.bodyText}>Deposit and rent terms are confirmed during payment.</Text>
        </Section>

        <Section title="Payment info" highlighted={paymentFocused}>
          <View style={styles.paymentRow}>
            <Image source={icons.mpesa} style={styles.paymentIcon} resizeMode="contain" />
            <View style={styles.agentCopy}>
              <Text style={styles.agentName}>Booking deposit</Text>
              <Text style={styles.mutedText}>Pay securely with M-Pesa or card.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bookButton} activeOpacity={0.85}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  highlighted = false,
  children,
}: {
  title: string;
  highlighted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.sectionCard, highlighted ? styles.highlightedCard : undefined]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoPill({ icon, label }: { icon: ImageSourcePropType; label: string }) {
  return (
    <View style={styles.infoPill}>
      <Image source={icon} style={styles.inlineIcon} resizeMode="contain" />
      <Text style={styles.infoText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light[300],
  },
  content: {
    paddingBottom: spacing["3xl"],
  },
  hero: {
    height: 280,
    backgroundColor: "#E1E6E8",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroBackButton: {
    position: "absolute",
    top: spacing.base,
    left: spacing.base,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    margin: spacing.base,
  },
  backIcon: {
    width: 22,
    height: 22,
  },
  headerCard: {
    margin: spacing.base,
    padding: spacing.base,
    borderRadius: 8,
    backgroundColor: "#E1E6E8",
  },
  title: {
    color: colors.dark[400],
    fontFamily: typography.family.headingBold,
    fontSize: typography.size.xl,
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  inlineIcon: {
    width: 18,
    height: 18,
    marginRight: spacing.xs,
  },
  mutedText: {
    color: colors.dark[100],
    fontFamily: typography.family.regular,
    fontSize: typography.size.sm,
    flexShrink: 1,
  },
  price: {
    color: colors.primary[700],
    fontFamily: typography.family.headingBold,
    fontSize: typography.size.lg,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.dark[200],
    fontFamily: typography.family.regular,
    fontSize: typography.size.base,
    lineHeight: 22,
  },
  summaryRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  infoPill: {
    flex: 1,
    minHeight: 46,
    borderRadius: 8,
    backgroundColor: "#E1E6E8",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  infoText: {
    color: colors.dark[300],
    fontFamily: typography.family.semibold,
    fontSize: typography.size.sm,
  },
  sectionCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    padding: spacing.base,
    borderRadius: 8,
    backgroundColor: "#E1E6E8",
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: colors.primary[700],
  },
  sectionTitle: {
    color: colors.dark[400],
    fontFamily: typography.family.headingBold,
    fontSize: typography.size.md,
    marginBottom: spacing.md,
  },
  agentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  agentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: spacing.md,
  },
  agentCopy: {
    flex: 1,
  },
  agentName: {
    color: colors.dark[300],
    fontFamily: typography.family.semibold,
    fontSize: typography.size.base,
    marginBottom: 2,
  },
  actionIcon: {
    width: 28,
    height: 28,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  amenityPill: {
    minHeight: 36,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.light[400],
  },
  amenityIcon: {
    width: 15,
    height: 15,
    marginRight: spacing.xs,
  },
  amenityText: {
    color: colors.dark[200],
    fontFamily: typography.family.medium,
    fontSize: typography.size.sm,
  },
  bodyText: {
    color: colors.dark[200],
    fontFamily: typography.family.regular,
    fontSize: typography.size.base,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.base,
  },
  paymentIcon: {
    width: 42,
    height: 42,
    marginRight: spacing.md,
  },
  bookButton: {
    minHeight: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[700],
  },
  bookButtonText: {
    color: colors.light[400],
    fontFamily: typography.family.semibold,
    fontSize: typography.size.base,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
});
