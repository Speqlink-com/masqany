/**
 * Property Admin Hooks - Usage Examples
 * 
 * This file demonstrates how to use the implemented query hooks
 * in React components following TanStack Query best practices.
 */

import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import {
    useAgents,
    useAnalytics,
    useProperties,
    useProperty,
    usePropertyUnits,
} from '../hooks';

// ---------------------------------------------------------------------------
// Example 1: Using useProperties with pagination and filtering
// ---------------------------------------------------------------------------

export function PropertiesListExample() {
  const [page, setPage] = React.useState(1);
  const [filter, setFilter] = React.useState('');

  const { data, isLoading, error, refetch } = useProperties({
    page,
    pageSize: 10,
    filter,
    sort: 'name',
    enabled: true, // Can be controlled based on conditions
  });

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return (
      <View>
        <Text>Error loading properties: {error.message}</Text>
        <Text onPress={() => refetch()}>Retry</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data?.properties}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.location.estate}</Text>
          <Text>Occupancy: {item.occupancyRate}%</Text>
        </View>
      )}
      onEndReached={() => {
        if (data?.pagination.hasMore) {
          setPage((prev) => prev + 1);
        }
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Example 2: Using useProperty for single property details
// ---------------------------------------------------------------------------

export function PropertyDetailsExample({ propertyId }: { propertyId: string }) {
  const { data: property, isLoading, error } = useProperty(propertyId, {
    enabled: !!propertyId, // Only fetch if propertyId exists
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !property) {
    return <Text>Property not found</Text>;
  }

  return (
    <View>
      <Text>{property.name}</Text>
      <Text>{property.type}</Text>
      <Text>Total Units: {property.totalUnits}</Text>
      <Text>Occupied: {property.occupiedUnits}</Text>
      <Text>Vacant: {property.vacantUnits}</Text>
      <Text>Occupancy Rate: {property.occupancyRate}%</Text>
      <Text>Monthly Rentals: {property.currency} {property.monthlyRentals}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 3: Using usePropertyUnits for unit grid
// ---------------------------------------------------------------------------

export function PropertyUnitsExample({ propertyId }: { propertyId: string }) {
  const { data, isLoading, error, refetch } = usePropertyUnits(propertyId, {
    enabled: !!propertyId,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View>
        <Text>Error loading units</Text>
        <Text onPress={() => refetch()}>Retry</Text>
      </View>
    );
  }

  const { units, property } = data || { units: [], property: null };

  return (
    <View>
      <Text>{property?.name}</Text>
      <Text>Total Rooms: {property?.totalUnits}</Text>
      <Text>Occupancy: {property?.occupiedUnits}/{property?.totalUnits}</Text>

      <FlatList
        data={units}
        numColumns={4}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor:
                item.status === 'occupied'
                  ? '#22C55E'
                  : item.status === 'vacant'
                  ? '#28b4f9'
                  : '#F59E0B',
            }}
          >
            <Text>{item.roomNumber}</Text>
            <Text>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 4: Using useAnalytics with period selection
// ---------------------------------------------------------------------------

export function AnalyticsDashboardExample() {
  const [period, setPeriod] = React.useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('monthly');

  const { data: analytics, isLoading, error } = useAnalytics(period, {
    enabled: true,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !analytics) {
    return <Text>Error loading analytics</Text>;
  }

  return (
    <View>
      {/* Period Selector */}
      <View style={{ flexDirection: 'row' }}>
        <Text onPress={() => setPeriod('daily')}>Daily</Text>
        <Text onPress={() => setPeriod('weekly')}>Weekly</Text>
        <Text onPress={() => setPeriod('monthly')}>Monthly</Text>
        <Text onPress={() => setPeriod('yearly')}>Yearly</Text>
      </View>

      {/* Analytics Cards */}
      <View>
        <View>
          <Text>Total Properties</Text>
          <Text>{analytics.totalProperties}</Text>
        </View>
        <View>
          <Text>Occupied Units</Text>
          <Text>{analytics.occupiedUnits}</Text>
        </View>
        <View>
          <Text>Vacant Units</Text>
          <Text>{analytics.vacantUnits}</Text>
        </View>
        <View>
          <Text>Occupancy Rate</Text>
          <Text>{analytics.occupancyRate}%</Text>
        </View>
        <View>
          <Text>Total Views</Text>
          <Text>{analytics.totalViews}</Text>
        </View>
        <View>
          <Text>Total Revenue</Text>
          <Text>{analytics.totalRevenue}</Text>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 5: Using useAgents
// ---------------------------------------------------------------------------

export function AgentsListExample() {
  const { data: agents, isLoading, error, refetch } = useAgents({
    enabled: true,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View>
        <Text>Error loading agents</Text>
        <Text onPress={() => refetch()}>Retry</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={agents}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.email}</Text>
          <Text>Properties: {item.totalProperties}</Text>
          <Text>Rating: {item.rating}/5</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Example 6: Conditional query execution with enabled flag
// ---------------------------------------------------------------------------

export function ConditionalQueryExample() {
  const [shouldFetch, setShouldFetch] = React.useState(false);

  // Query will only execute when shouldFetch is true
  const { data, isLoading, isFetching } = useProperties({
    enabled: shouldFetch,
  });

  return (
    <View>
      <Text onPress={() => setShouldFetch(true)}>Load Properties</Text>
      {isFetching && <ActivityIndicator />}
      {data && <Text>Loaded {data.properties.length} properties</Text>}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 7: Using multiple hooks together
// ---------------------------------------------------------------------------

export function DashboardExample() {
  // Fetch analytics with 1 minute staleTime
  const { data: analytics } = useAnalytics('monthly');

  // Fetch properties with 5 minute staleTime
  const { data: propertiesData } = useProperties({
    page: 1,
    pageSize: 5,
  });

  // Fetch agents with 5 minute staleTime
  const { data: agents } = useAgents();

  return (
    <View>
      {/* Analytics Section */}
      <View>
        <Text>Occupancy Rate: {analytics?.occupancyRate}%</Text>
        <Text>Total Views: {analytics?.totalViews}</Text>
      </View>

      {/* Properties Section */}
      <View>
        <Text>My Properties ({propertiesData?.properties.length})</Text>
        {propertiesData?.properties.map((property) => (
          <Text key={property.id}>{property.name}</Text>
        ))}
      </View>

      {/* Agents Section */}
      <View>
        <Text>My Agents ({agents?.length})</Text>
        {agents?.map((agent) => (
          <Text key={agent.id}>{agent.name}</Text>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 8: Pull-to-refresh pattern
// ---------------------------------------------------------------------------

export function PullToRefreshExample() {
  const { data, isLoading, refetch, isRefetching } = useProperties();

  return (
    <FlatList
      data={data?.properties}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      refreshing={isRefetching}
      onRefresh={() => refetch()}
    />
  );
}

// ---------------------------------------------------------------------------
// Example 9: Error handling with retry
// ---------------------------------------------------------------------------

export function ErrorHandlingExample() {
  const { data, error, isLoading, refetch, failureCount } = useProperties();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View>
        <Text>Failed to load properties</Text>
        <Text>Error: {error.message}</Text>
        <Text>Attempts: {failureCount}/2</Text>
        <Text onPress={() => refetch()}>Try Again</Text>
      </View>
    );
  }

  return (
    <View>
      {data?.properties.map((property) => (
        <Text key={property.id}>{property.name}</Text>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 10: Dependent queries
// ---------------------------------------------------------------------------

export function DependentQueriesExample({ propertyId }: { propertyId: string }) {
  // First query: fetch property details
  const { data: property, isLoading: isLoadingProperty } = useProperty(
    propertyId,
    {
      enabled: !!propertyId,
    }
  );

  // Second query: fetch units only after property is loaded
  const { data: unitsData, isLoading: isLoadingUnits } = usePropertyUnits(
    propertyId,
    {
      enabled: !!property, // Only fetch units after property is loaded
    }
  );

  if (isLoadingProperty) {
    return <Text>Loading property...</Text>;
  }

  if (isLoadingUnits) {
    return <Text>Loading units...</Text>;
  }

  return (
    <View>
      <Text>{property?.name}</Text>
      <Text>Units: {unitsData?.units.length}</Text>
    </View>
  );
}
