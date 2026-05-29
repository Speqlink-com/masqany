import {
  ActiveMoveCard,
  DriverProfileCard,
  SectionHeader,
  UpcomingMoveCard,
} from "@/components/driver-dashboard";
import icons from "@/constants/icons";
import { colors, spacing, typography } from "@/constants/tokens";
import {
  useAcceptMove,
  useDriverDashboard,
  useDriverDashboardStore,
  useRejectMove,
  useStartMove,
} from "@/modules/driver-dashboard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriverDashboardScreen() {
  const router = useRouter();
  const dashboard = useDriverDashboard();
  const acceptMove = useAcceptMove();
  const rejectMove = useRejectMove();
  const startMove = useStartMove();
  const isRefreshing = useDriverDashboardStore((state) => state.isRefreshing);
  const setRefreshing = useDriverDashboardStore((state) => state.setRefreshing);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const data = dashboard.data;

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setRefreshing(true);
    try {
      await dashboard.refetch();
    } finally {
      setRefreshing(false);
    }
  }, [dashboard, isRefreshing, setRefreshing]);

  const handleStartMove = useCallback(
    async (activeMoveId: string) => {
      try {
        await startMove.mutateAsync({
          activeMoveId,
          driverId: data?.profile.id ?? "driver-001",
          startedAt: new Date().toISOString(),
          currentLocation: {
            latitude: -1.2921,
            longitude: 36.8219,
          },
        });
        router.push(`/(driver)/move-execution/${activeMoveId}` as never);
      } catch {
        Alert.alert("Unable to start move", "Please try again in a moment.");
      }
    },
    [data?.profile.id, router, startMove]
  );

  const handleMessage = useCallback(
    (clientId: string, clientName: string) => {
      router.push({
        pathname: "/(tabs)/chat-agent",
        params: { clientId, clientName },
      } as never);
    },
    [router]
  );

  const handleCall = useCallback(async (clientPhone: string) => {
    const phoneUrl = `tel:${clientPhone}`;
    const canOpen = await Linking.canOpenURL(phoneUrl);
    if (canOpen) {
      await Linking.openURL(phoneUrl);
    }
  }, []);

  const handleConfirmMove = useCallback(
    async (moveRequestId: string) => {
      try {
        await acceptMove.mutateAsync({
          moveRequestId,
          driverId: data?.profile.id ?? "driver-001",
          acceptedAt: new Date().toISOString(),
        });
      } catch {
        Alert.alert("Move unavailable", "This move may already have been accepted.");
      }
    },
    [acceptMove, data?.profile.id]
  );

  const handleRejectMove = useCallback(
    async (moveRequestId: string) => {
      try {
        await rejectMove.mutateAsync({
          moveRequestId,
          driverId: data?.profile.id ?? "driver-001",
          rejectionReason: "Driver declined",
        });
      } catch {
        Alert.alert("Unable to reject move", "Please try again.");
      }
    },
    [data?.profile.id, rejectMove]
  );

  if (dashboard.isLoading) {
    return (
      <ImageBackground 
        source={require("@/assets/images/property-registration-initial-screen.webp")} 
        style={styles.background} 
        resizeMode="cover"
      >
        <StatusBar style="light" />
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary[700]} size="large" />
          <Text style={styles.stateText}>Loading driver dashboard</Text>
        </View>
        
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarLine} />
        </View>
      </ImageBackground>
    );
  }

  if (dashboard.isError || !data) {
    return (
      <ImageBackground 
        source={require("@/assets/images/property-registration-initial-screen.webp")} 
        style={styles.background} 
        resizeMode="cover"
      >
        <StatusBar style="light" />
        <View style={styles.centerState}>
          <Text style={styles.stateTitle}>Dashboard unavailable</Text>
          <Text style={styles.stateText}>We could not load your driver jobs right now.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => dashboard.refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarLine} />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={require("@/assets/images/property-registration-initial-screen.webp")} 
      style={styles.background} 
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* Header Section - 30% of screen */}
        <View style={styles.headerSection}>
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => setSidebarVisible(!sidebarVisible)}
              style={styles.menuButton}
            >
              <Image
                source={require("@/assets/icons/menu.png")}
                style={styles.menuIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={styles.profileContainer}>
              <DriverProfileCard profile={data.profile} />
            </View>

            <TouchableOpacity style={styles.menuButton}>
              <Image
                source={icons.bell}
                style={styles.menuIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary[700]}
              colors={[colors.primary[700]]}
            />
          }
        >
          {/* Performance Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            <View style={styles.metricsRow}>
              {/* Total Trips - Gradient #cdffd8 to #94b9ff */}
              <LinearGradient
                colors={["#cdffd8", "#94b9ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.metricCard}
              >
                <Image
                  source={icons.tripMetrics}
                  style={styles.metricIcon}
                  resizeMode="contain"
                />
                <Text style={styles.metricLabelDark}>Total Trips</Text>
                <Text style={styles.metricValueDark}>{data.metrics.totalTrips}</Text>
              </LinearGradient>

              {/* Weekly Income - Gray/White #f5f5f5 */}
              <View style={[styles.metricCard, { backgroundColor: "#f5f5f5" }]}>
                <Image
                  source={icons.incomeMetrics}
                  style={styles.metricIcon}
                  resizeMode="contain"
                />
                <Text style={styles.metricLabelDark}>Weekly Income</Text>
                <Text style={styles.metricValueDark}>KSh {data.metrics.weeklyIncome.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              {/* Clients Served - Cyan to Cobalt Blue #00CED1 to #004AAD */}
              <LinearGradient
                colors={["#00CED1", "#004AAD"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.metricCard}
              >
                <Image
                  source={icons.clientsMetrics}
                  style={styles.metricIcon}
                  resizeMode="contain"
                />
                <Text style={styles.metricLabel}>Clients Served</Text>
                <Text style={styles.metricValue}>{data.metrics.totalClients}</Text>
              </LinearGradient>

              {/* Distance Traveled - Gradient #333333 to #898989 */}
              <LinearGradient
                colors={["#333333", "#898989"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.metricCard}
              >
                <Image
                  source={icons.location}
                  style={styles.metricIcon}
                  resizeMode="contain"
                />
                <Text style={styles.metricLabel}>Distance</Text>
                <Text style={styles.metricValue}>{data.metrics.totalDistanceKm} km</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Active Moves */}
          <View style={styles.section}>
            <SectionHeader
              icon={icons.activeMove}
              title="Active moves!!"
              actionText="refresh"
              onActionPress={handleRefresh}
            />
            {data.activeMoves.length > 0 ? (
              data.activeMoves.map((move) => (
                <ActiveMoveCard
                  key={move.id}
                  move={move}
                  onStartMove={handleStartMove}
                  onMessage={handleMessage}
                  onCall={handleCall}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No active moves right now.</Text>
            )}
          </View>

          {/* Upcoming Moves */}
          <View style={styles.section}>
            <SectionHeader
              icon={icons.upcomingMoves}
              title="Upcoming moves"
              actionText="view all"
              onActionPress={() => Alert.alert("Upcoming moves", "All available requests are shown.")}
            />
            {data.upcomingMoves.length > 0 ? (
              data.upcomingMoves.map((moveRequest) => (
                <UpcomingMoveCard
                  key={moveRequest.id}
                  moveRequest={moveRequest}
                  onConfirm={handleConfirmMove}
                  onReject={handleRejectMove}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No upcoming requests available.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarLine} />
      </View>

      {sidebarVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSidebarVisible(false)}
          style={styles.sidebarOverlay}
        >
          <View style={styles.sidebar}>
            <Image
              source={require("@/assets/images/side-bar.png")}
              style={styles.sidebarImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerSection: {
    height: "30%",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  menuButton: {
    padding: spacing.sm,
  },
  menuIcon: {
    width: 28,
    height: 28,
  },
  profileContainer: {
    flex: 1,
    marginHorizontal: spacing.base,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.family.headingBold,
    fontSize: typography.size.xl,
    color: colors.dark[400],
    marginBottom: spacing.base,
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.base,
    marginBottom: spacing.base,
  },
  metricCard: {
    flex: 1,
    padding: spacing.base,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  metricIcon: {
    width: 48,
    height: 48,
    marginBottom: spacing.sm,
  },
  metricLabel: {
    fontFamily: typography.family.medium,
    fontSize: 14,
    color: colors.light[400],
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  metricLabelDark: {
    fontFamily: typography.family.medium,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  metricValue: {
    fontFamily: typography.family.headingBold,
    fontSize: 16,
    color: colors.light[400],
  },
  metricValueDark: {
    fontFamily: typography.family.headingBold,
    fontSize: 16,
    color: "#111827",
  },
  emptyText: {
    color: colors.dark[100],
    fontFamily: typography.family.medium,
    fontSize: typography.size.base,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  stateTitle: {
    color: colors.dark[400],
    fontFamily: typography.family.headingBold,
    fontSize: typography.size.xl,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  stateText: {
    color: colors.dark[100],
    fontFamily: typography.family.medium,
    fontSize: typography.size.base,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  retryButton: {
    minHeight: 44,
    marginTop: spacing.base,
    borderRadius: 22,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[700],
  },
  retryText: {
    color: colors.light[400],
    fontFamily: typography.family.semibold,
    fontSize: typography.size.base,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#3fbdfd",
    zIndex: 50,
  },
  bottomBarLine: {
    height: 1,
    backgroundColor: "#000000",
  },
  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 40,
  },
  sidebar: {
    width: 256,
    height: "100%",
    backgroundColor: "#ffffff",
  },
  sidebarImage: {
    width: "100%",
    height: "100%",
  },
});
