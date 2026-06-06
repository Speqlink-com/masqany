import { mockVideoFeedData } from "@/assets/data/video-feed";
import { BackButton } from "@/components/auth/BackButton";
import icons from "@/constants/icons";
import { mockProperties } from "@/constants/mockProperties";
import { colors, spacing, typography } from "@/constants/tokens";
import type { PriceUnit, PropertyVideo } from "@/modules/video-feed/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type React from "react";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const THEME_BLUE = "#3fbdfd";
const CARD_BG = "#E1E6E8";
const SCREEN_WIDTH = Dimensions.get("window").width;

const galleryAssets = [
  require("@/assets/prop-images/image2.jpeg"),
  require("@/assets/prop-images/image3.jpeg"),
  require("@/assets/prop-images/image4.jpeg"),
  require("@/assets/prop-images/image5.jpeg"),
  require("@/assets/prop-images/image6.jpeg"),
];

type ListingStatus = "vacant" | "soon_vacant" | "occupied";

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  price: number;
  priceUnit: PriceUnit;
  location: string;
  coordinates?: [number, number];
  bedrooms: number;
  bathrooms: number;
  size?: number;
  amenities: string[];
  status: ListingStatus;
  availableDate?: string;
  agent?: {
    name: string;
    phone: string;
    avatar: string;
    isVerified: boolean;
    role: string;
  };
  gallery: ImageSourcePropType[];
  policies: string[];
  deposits: {
    label: string;
    amount: number;
    note: string;
  }[];
  paymentMethods: string[];
  tenantAccessFee: number;
  serviceUnlocks: string[];
}

function formatPrice(amount: number, unit?: PriceUnit) {
  const suffix = unit ? ` / ${unit}` : "";
  return `KES ${amount.toLocaleString("en-KE")}${suffix}`;
}

function getStatusLabel(status: ListingStatus) {
  if (status === "soon_vacant") return "Coming soon";
  if (status === "occupied") return "Occupied";
  return "Available now";
}

function createGallery(thumbnailUrl?: string): ImageSourcePropType[] {
  const thumbnail = thumbnailUrl ? [{ uri: thumbnailUrl }] : [];
  return [...thumbnail, ...galleryAssets];
}

function makePolicies(videoProperty?: PropertyVideo) {
  const rules = [
    "Request physical viewing first. Owners or agents approve viewing before you travel.",
    "Confirm the unit is still vacant before going for viewing.",
    "Masqany recommends physical inspection and direct agreement with the owner or appointed agent.",
    "Exact location, live chat, and contacts are enabled through verified access.",
  ];

  if (videoProperty?.priceUnit === "month") {
    return [
      ...rules,
      "Long stay rent and deposits are confirmed with the owner before move-in.",
    ];
  }

  return [
    ...rules,
    "Short stay check-in, cancellation, and guest rules are confirmed before booking.",
  ];
}

function getProperty(propertyId: string): ListingDetail | null {
  const videoProperty = mockVideoFeedData.find((property) => property.id === propertyId);
  if (videoProperty) {
    const isLongStay = videoProperty.priceUnit === "month";

    return {
      id: videoProperty.id,
      title: videoProperty.title,
      description: videoProperty.description,
      propertyType: videoProperty.propertyType,
      price: videoProperty.price,
      priceUnit: videoProperty.priceUnit,
      location: `${videoProperty.location.estate}, ${videoProperty.location.county}`,
      coordinates: videoProperty.location.coordinates,
      bedrooms: videoProperty.bedrooms,
      bathrooms: videoProperty.bathrooms,
      size: videoProperty.size,
      amenities: videoProperty.amenities,
      status: videoProperty.unitStatus,
      availableDate: videoProperty.availableDate,
      agent: {
        name: videoProperty.owner.name,
        phone: "+254712345678",
        avatar: videoProperty.owner.avatar,
        isVerified: videoProperty.owner.isVerified,
        role: isLongStay ? "Property owner" : "Host or agent",
      },
      gallery: createGallery(videoProperty.thumbnailUrl),
      policies: makePolicies(videoProperty),
      deposits: isLongStay
        ? [
            {
              label: "Security deposit",
              amount: videoProperty.price,
              note: "Usually one month, confirmed by owner.",
            },
            {
              label: "Water and electricity",
              amount: 0,
              note: "Metered or included depending on the unit.",
            },
          ]
        : [
            {
              label: "Stay deposit",
              amount: 0,
              note: "If required, host confirms before check-in.",
            },
            {
              label: "Cleaning or service fee",
              amount: 0,
              note: "Shown before payment when backend billing is enabled.",
            },
          ],
      paymentMethods: ["M-Pesa", "Card", "Cash with owner or agent"],
      tenantAccessFee: 0,
      serviceUnlocks: [
        "Exact map location",
        "Live chat",
        "Agent or owner contact",
        "Physical viewing request",
      ],
    };
  }

  const moveProperty = mockProperties.find((property) => String(property.id) === propertyId);
  if (moveProperty) {
    return {
      id: String(moveProperty.id),
      title: moveProperty.title,
      description:
        "A nearby Masqany listing selected from the map. Full media and verified backend details will attach once property APIs are ready.",
      propertyType: "1BR",
      price: moveProperty.price,
      priceUnit: "month",
      location: moveProperty.location,
      coordinates: moveProperty.coords,
      bedrooms: moveProperty.bedrooms ?? 1,
      bathrooms: moveProperty.bathrooms ?? 1,
      size: moveProperty.area,
      amenities: ["Water", "Security", "Parking", "Transport access"],
      status: "vacant",
      agent: {
        name: "Masqany Agent",
        phone: "+254712345678",
        avatar: "https://i.pravatar.cc/150?img=18",
        isVerified: true,
        role: "Property agent",
      },
      gallery: createGallery(),
      policies: makePolicies(),
      deposits: [
        {
          label: "Security deposit",
          amount: moveProperty.price,
          note: "Confirmed with owner before move-in.",
        },
        {
          label: "Utilities deposit",
          amount: 0,
          note: "Water, electricity, and security terms are confirmed by owner.",
        },
      ],
      paymentMethods: ["M-Pesa", "Card", "Cash with owner or agent"],
      tenantAccessFee: 0,
      serviceUnlocks: [
        "Exact map location",
        "Live chat",
        "Agent or owner contact",
        "Physical viewing request",
      ],
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const paymentFocused = focus === "payment";

  const handleShare = async () => {
    if (!property) return;
    await Share.share({
      title: property.title,
      message: `${property.title}\n${property.location}\n${formatPrice(
        property.price,
        property.priceUnit
      )}`,
    });
  };

  const handleDownloadImage = () => {
    Alert.alert("Image saved", "Property image has been saved to your device.");
  };

  const handleCallAgent = () => {
    if (!property?.agent?.phone) {
      Alert.alert("Contact unavailable", "Agent contact will appear after verification.");
      return;
    }
    Linking.openURL(`tel:${property.agent.phone}`);
  };

  const handleOpenChat = () => {
    Alert.alert("Live chat", "Live chat is unlocked for this property access session.");
  };

  const handleOpenMap = () => {
    router.push("/(tabs)/move" as never);
  };

  const handleRequestViewing = () => {
    Alert.alert(
      "Viewing request sent",
      "The owner or agent will confirm availability before you go for physical viewing."
    );
  };

  const handlePayAccessFee = () => {
    Alert.alert(
      "Unlock Access",
      "Get exact location, live chat with owner, and contact details."
    );
  };

  if (!property) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <ImageBackground 
          source={require("@/assets/images/app-full-screen.webp")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.emptySafeArea}>
            <BackButton />
            <View style={styles.emptyState}>
              <Text style={styles.title}>Listing unavailable</Text>
              <Text style={styles.mutedText}>This property could not be found.</Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ImageBackground 
        source={require("@/assets/images/app-full-screen.webp")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
              <FlatList
                data={property.gallery}
                keyExtractor={(_, index) => `gallery-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToAlignment="center"
                snapToInterval={SCREEN_WIDTH}
                getItemLayout={(_, index) => ({
                  length: SCREEN_WIDTH,
                  offset: SCREEN_WIDTH * index,
                  index,
                })}
                removeClippedSubviews
                maxToRenderPerBatch={2}
                windowSize={3}
                initialNumToRender={1}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                  setActiveImageIndex(index);
                }}
                renderItem={({ item }) => (
                  <Image source={item} style={styles.heroImage} resizeMode="cover" />
                )}
              />

              <View style={styles.heroTopRow}>
                <BackButton />
                <View style={styles.heroActions}>
                  <IconButton icon={icons.upload} onPress={handleShare} />
                  <IconButton
                    icon={require("@/assets/icons/download.png")}
                    onPress={handleDownloadImage}
                  />
                </View>
              </View>

              <View style={styles.galleryDots}>
                {property.gallery.map((_, index) => (
                  <View
                    key={`dot-${index}`}
                    style={[
                      styles.galleryDot,
                      activeImageIndex === index ? styles.activeGalleryDot : undefined,
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.headerCard}>
              <View style={styles.statusRow}>
                <Text style={styles.statusText}>{getStatusLabel(property.status)}</Text>
                <Text style={styles.typeText}>{property.propertyType}</Text>
              </View>
              <Text style={styles.title}>{property.title}</Text>
              <View style={styles.locationRow}>
                <Image source={icons.location} style={styles.inlineIcon} resizeMode="contain" />
                <Text style={styles.mutedText}>{property.location}</Text>
              </View>
              <Text style={styles.price}>{formatPrice(property.price, property.priceUnit)}</Text>
              <Text style={styles.description}>{property.description}</Text>
            </View>

            <View style={styles.summaryRow}>
              <InfoPill icon={icons.bed} label={`${property.bedrooms} beds`} />
              <InfoPill icon={icons.bath} label={`${property.bathrooms} baths`} />
              <InfoPill icon={icons.area} label={`${property.size ?? 0} sqft`} />
            </View>

            {property.agent ? (
              <Section title="Agent and owner access">
                <View style={styles.agentRow}>
                  <Image source={{ uri: property.agent.avatar }} style={styles.agentAvatar} />
                  <View style={styles.agentCopy}>
                    <Text style={styles.agentName}>{property.agent.name}</Text>
                    <Text style={styles.mutedText}>
                      {property.agent.isVerified ? "Verified " : ""}
                      {property.agent.role}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionGrid}>
                  <ActionButton icon={icons.chat} label="Live chat" onPress={handleOpenChat} />
                  <ActionButton icon={icons.phone} label="Call" onPress={handleCallAgent} />
                  <ActionButton icon={icons.location} label="Map" onPress={handleOpenMap} />
                </View>
              </Section>
            ) : null}

            <Section title="Verified property access" highlighted={paymentFocused}>
              <View style={styles.unlockHeader}>
                <Image source={icons.shield} style={styles.unlockIcon} resizeMode="contain" />
                <View style={styles.agentCopy}>
                  <Text style={styles.agentName}>Tenant access fee: KES 0.00</Text>
                  <Text style={styles.mutedText}>
                    Premium access is free during the initial Masqany phase.
                  </Text>
                </View>
              </View>
              <View style={styles.amenitiesGrid}>
                {property.serviceUnlocks.map((item) => (
                  <View key={item} style={styles.amenityPill}>
                    <Image source={icons.success} style={styles.amenityIcon} resizeMode="contain" />
                    <Text style={styles.amenityText}>{item}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={handlePayAccessFee}>
                <Text style={styles.primaryButtonText}>Unlock Access</Text>
              </TouchableOpacity>
            </Section>

            <Section title="Physical viewing">
              <Text style={styles.bodyText}>
                Masqany recommends physical viewing and direct agreement before rent, stay, or deposit payment.
              </Text>
              <Text style={styles.bodyText}>
                Always confirm with the owner or agent that the property is still vacant before travelling.
              </Text>
              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85} onPress={handleRequestViewing}>
                <Text style={styles.secondaryButtonText}>Request Physical Viewing</Text>
              </TouchableOpacity>
            </Section>

            <Section title="Amenities available">
              <View style={styles.amenitiesGrid}>
                {property.amenities.map((amenity) => (
                  <View key={amenity} style={styles.amenityPill}>
                    <Image source={amenityIconFor(amenity)} style={styles.amenityIcon} resizeMode="contain" />
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </Section>

            <Section title="Price and deposits">
              <PriceLine label="Property price" value={formatPrice(property.price, property.priceUnit)} />
              {property.deposits.map((deposit) => (
                <PriceLine
                  key={deposit.label}
                  label={deposit.label}
                  value={deposit.amount > 0 ? formatPrice(deposit.amount) : "To confirm"}
                  note={deposit.note}
                />
              ))}
            </Section>

            <Section title="Payment information" highlighted={paymentFocused}>
              <Text style={styles.bodyText}>
                Masqany does not collect rent, stay payment, or deposits from tenants.
              </Text>
              <View style={styles.paymentMethods}>
                {property.paymentMethods.map((method) => (
                  <View key={method} style={styles.paymentMethodPill}>
                    <Image source={paymentIconFor(method)} style={styles.paymentIcon} resizeMode="contain" />
                    <Text style={styles.paymentMethodText}>{method}</Text>
                  </View>
                ))}
              </View>
            </Section>
          </ScrollView>
        </SafeAreaView>
        <View pointerEvents="none" style={styles.bottomBlueBar}>
          <View style={styles.bottomDivider} />
        </View>
      </ImageBackground>
    </View>
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

function IconButton({
  icon,
  onPress,
}: {
  icon: ImageSourcePropType;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.iconButton} activeOpacity={0.8} onPress={onPress}>
      <Image source={icon} style={styles.iconButtonImage} resizeMode="contain" />
    </TouchableOpacity>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: ImageSourcePropType;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionButton} activeOpacity={0.82} onPress={onPress}>
      <Image source={icon} style={styles.actionButtonIcon} resizeMode="contain" />
      <Text style={styles.actionButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function BulletText({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bodyText}>{children}</Text>
    </View>
  );
}

function PriceLine({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <View style={styles.priceLine}>
      <View style={styles.agentCopy}>
        <Text style={styles.priceLineLabel}>{label}</Text>
        {note ? <Text style={styles.mutedText}>{note}</Text> : null}
      </View>
      <Text style={styles.priceLineValue}>{value}</Text>
    </View>
  );
}

function amenityIconFor(amenity: string) {
  const normalized = amenity.toLowerCase();
  if (normalized.includes("wifi")) return icons.wifi;
  if (normalized.includes("parking")) return icons.carPark;
  if (normalized.includes("gym")) return icons.dumbell;
  if (normalized.includes("pool")) return icons.swim;
  if (normalized.includes("garden")) return icons.home;
  if (normalized.includes("water")) return icons.support;
  if (normalized.includes("security")) return icons.shield;
  return icons.success;
}

function paymentIconFor(method: string) {
  const normalized = method.toLowerCase();
  if (normalized.includes("m-pesa")) return icons.mpesa;
  if (normalized.includes("card")) return icons.card;
  if (normalized.includes("cash")) return icons.cash;
  return icons.wallet;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light[300],
  },
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  emptySafeArea: {
    flex: 1,
    padding: spacing.base,
  },
  bottomBlueBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: THEME_BLUE,
    zIndex: 10,
  },
  bottomDivider: {
    height: 2,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingBottom: 124,
  },
  hero: {
    height: 330,
    backgroundColor: "#000000",
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: 330,
  },
  heroTopRow: {
    position: "absolute",
    top: spacing.base,
    left: spacing.base,
    right: spacing.base,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  iconButtonImage: {
    width: 19,
    height: 19,
  },
  galleryDots: {
    position: "absolute",
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  galleryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  activeGalleryDot: {
    width: 20,
    backgroundColor: THEME_BLUE,
  },
  headerCard: {
    margin: spacing.base,
    padding: spacing.base,
    borderRadius: 8,
    backgroundColor: CARD_BG,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  statusText: {
    overflow: "hidden",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    color: colors.dark[400],
    fontFamily: typography.family.semibold,
    fontSize: typography.size.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  typeText: {
    color: colors.primary[700],
    fontFamily: typography.family.semibold,
    fontSize: typography.size.sm,
    textTransform: "capitalize",
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
    lineHeight: 18,
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
    backgroundColor: CARD_BG,
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
    backgroundColor: CARD_BG,
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
    marginBottom: spacing.md,
  },
  agentAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: spacing.md,
    backgroundColor: colors.light[200],
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
  actionGrid: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: spacing.sm,
  },
  actionButtonIcon: {
    width: 18,
    height: 18,
    marginRight: spacing.xs,
  },
  actionButtonText: {
    color: colors.dark[300],
    fontFamily: typography.family.semibold,
    fontSize: typography.size.sm,
  },
  unlockHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  unlockIcon: {
    width: 42,
    height: 42,
    marginRight: spacing.md,
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
  primaryButton: {
    minHeight: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME_BLUE,
    marginTop: spacing.base,
  },
  primaryButtonText: {
    color: colors.light[400],
    fontFamily: typography.family.semibold,
    fontSize: typography.size.base,
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: THEME_BLUE,
    marginTop: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.dark[400],
    fontFamily: typography.family.semibold,
    fontSize: typography.size.base,
  },
  bodyText: {
    color: colors.dark[200],
    fontFamily: typography.family.regular,
    fontSize: typography.size.base,
    lineHeight: 22,
    marginBottom: spacing.xs,
    flex: 1,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  bulletDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: THEME_BLUE,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  priceLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
    gap: spacing.md,
  },
  priceLineLabel: {
    color: colors.dark[300],
    fontFamily: typography.family.semibold,
    fontSize: typography.size.base,
  },
  priceLineValue: {
    color: colors.dark[400],
    fontFamily: typography.family.headingBold,
    fontSize: typography.size.sm,
    textAlign: "right",
  },
  paymentMethods: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  paymentMethodPill: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.md,
  },
  paymentIcon: {
    width: 18,
    height: 18,
    marginRight: spacing.xs,
  },
  paymentMethodText: {
    color: colors.dark[300],
    fontFamily: typography.family.semibold,
    fontSize: typography.size.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
});
