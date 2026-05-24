import {
  ActiveMoveCard,
  DriverProfileCard,
  MetricsGrid,
  SectionHeader,
  StatusBarProtection,
  TabBarProtection,
  UpcomingMoveCard,
} from "@/components/driver-dashboard";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { colors, spacing, typography } from "@/constants/tokens";
import {
  useAcceptMove,
  useDriverDashboard,
  useDriverDashboardStore,
  useRejectMove,
  useStartMove,
} from "@/modules/driver-dashboard";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
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
      <ImageBackground source={images.appFullScreen} style={styles.background} resizeMode="cover">
        <StatusBar style="light" />
        <StatusBarProtection />
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary[700]} size="large" />
          <Text style={styles.stateText}>Loading driver dashboard</Text>
        </View>
        <TabBarProtection />
      </ImageBackground>
    );
  }

  if (dashboard.isError || !data) {
    return (
      <ImageBackground source={images.appFullScreen} style={styles.background} resizeMode="cover">
        <StatusBar style="light" />
        <StatusBarProtection />
        <View style={styles.centerState}>
          <Text style={styles.stateTitle}>Dashboard unavailable</Text>
          <Text style={styles.stateText}>We could not load your driver jobs right now.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => dashboard.refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <TabBarProtection />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={images.appFullScreen} style={styles.background} resizeMode="cover">
      <StatusBar style="light" />
      <StatusBarProtection />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.content}
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
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconButton} accessibilityRole="button">
              <Image source={icons.filter} style={styles.headerIcon} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} accessibilityRole="button">
              <Image source={icons.bell} style={styles.headerIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileRow}>
            <DriverProfileCard profile={data.profile} />
          </View>

          <MetricsGrid metrics={data.metrics} />

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
        </ScrollView>
      </SafeAreaView>
      <TabBarProtection />
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
  content: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: 128,
  },
  header: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.86)",
  },
  headerIcon: {
    width: 22,
    height: 22,
  },
  profileRow: {
    marginBottom: spacing.lg,
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
});
