/**
 * PropertyAdminStore Usage Examples
 * Demonstrates how to use the store in React components
 */

import {
    Property,
    selectIsSidebarOpen,
    selectIsStatusModalOpen,
    selectSelectedProperty,
    selectSelectedUnit,
    selectSelectedUnits,
    Unit,
    usePropertyAdminStore,
} from '@/modules/property-admin';
import React from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';

// ---------------------------------------------------------------------------
// Example 1: Sidebar Integration
// ---------------------------------------------------------------------------

export function DashboardWithSidebar() {
  // Subscribe to sidebar state using selector
  const isSidebarOpen = usePropertyAdminStore(selectIsSidebarOpen);
  
  // Get actions from store
  const { openSidebar, closeSidebar } = usePropertyAdminStore();

  return (
    <View>
      <Button title="Open Menu" onPress={openSidebar} />
      
      {isSidebarOpen && (
        <View style={{ position: 'absolute', left: 0, top: 0 }}>
          <Text>Sidebar Content</Text>
          <Button title="Close" onPress={closeSidebar} />
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 2: Status Modal Integration
// ---------------------------------------------------------------------------

export function UnitsScreenWithModal() {
  const isModalOpen = usePropertyAdminStore(selectIsStatusModalOpen);
  const selectedUnit = usePropertyAdminStore(selectSelectedUnit);
  const { openStatusModal, closeStatusModal, setSelectedUnit } = usePropertyAdminStore();

  const handleUnitPress = (unit: Unit) => {
    setSelectedUnit(unit);
    openStatusModal();
  };

  const handleConfirm = () => {
    // Update unit status logic here
    closeStatusModal();
  };

  return (
    <View>
      {/* Unit Grid would go here */}
      
      {isModalOpen && selectedUnit && (
        <View style={{ position: 'absolute', top: '50%', left: '50%' }}>
          <Text>Change Status for {selectedUnit.roomNumber}</Text>
          <Button title="Confirm" onPress={handleConfirm} />
          <Button title="Cancel" onPress={closeStatusModal} />
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 3: Property Selection
// ---------------------------------------------------------------------------

export function PropertySelector() {
  const selectedProperty = usePropertyAdminStore(selectSelectedProperty);
  const { setSelectedProperty } = usePropertyAdminStore();

  const properties: Property[] = [
    // Mock properties would come from useProperties hook
  ];

  return (
    <View>
      <Text>Selected: {selectedProperty?.name || 'None'}</Text>
      
      {properties.map((property) => (
        <TouchableOpacity
          key={property.id}
          onPress={() => setSelectedProperty(property)}
        >
          <Text>{property.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 4: Bulk Unit Selection
// ---------------------------------------------------------------------------

export function BulkUnitActions() {
  const selectedUnits = usePropertyAdminStore(selectSelectedUnits);
  const { toggleUnitSelection, clearSelections } = usePropertyAdminStore();

  const units: Unit[] = [
    // Mock units would come from usePropertyUnits hook
  ];

  const handleBulkAction = () => {
    console.log('Performing action on units:', selectedUnits);
    // Perform bulk action here
    clearSelections();
  };

  return (
    <View>
      <Text>Selected Units: {selectedUnits.length}</Text>
      
      {units.map((unit) => (
        <TouchableOpacity
          key={unit.id}
          onPress={() => toggleUnitSelection(unit.id)}
          style={{
            backgroundColor: selectedUnits.includes(unit.id) ? 'blue' : 'gray',
          }}
        >
          <Text>{unit.roomNumber}</Text>
        </TouchableOpacity>
      ))}
      
      {selectedUnits.length > 0 && (
        <>
          <Button title="Perform Bulk Action" onPress={handleBulkAction} />
          <Button title="Clear Selection" onPress={clearSelections} />
        </>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 5: Combined Usage (Dashboard with All Features)
// ---------------------------------------------------------------------------

export function FullDashboardExample() {
  // Subscribe to multiple state slices
  const isSidebarOpen = usePropertyAdminStore(selectIsSidebarOpen);
  const isModalOpen = usePropertyAdminStore(selectIsStatusModalOpen);
  const selectedProperty = usePropertyAdminStore(selectSelectedProperty);
  
  // Get all actions
  const {
    openSidebar,
    closeSidebar,
    toggleSidebar,
    openStatusModal,
    closeStatusModal,
    setSelectedProperty,
    clearSelections,
  } = usePropertyAdminStore();

  return (
    <View>
      {/* Header with menu button */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button title="☰" onPress={toggleSidebar} />
        <Text>Property Admin Dashboard</Text>
      </View>

      {/* Main content */}
      <View>
        {selectedProperty ? (
          <Text>Managing: {selectedProperty.name}</Text>
        ) : (
          <Text>Select a property</Text>
        )}
        
        <Button title="Change Unit Status" onPress={openStatusModal} />
      </View>

      {/* Sidebar */}
      {isSidebarOpen && (
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0 }}>
          <Text>Sidebar Menu</Text>
          <Button title="Close" onPress={closeSidebar} />
        </View>
      )}

      {/* Status Modal */}
      {isModalOpen && (
        <View style={{ position: 'absolute', top: '50%', left: '50%' }}>
          <Text>Status Change Modal</Text>
          <Button title="Close" onPress={closeStatusModal} />
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 6: Using Store Outside Components (for utilities/helpers)
// ---------------------------------------------------------------------------

export function utilityFunction() {
  // You can access store state outside components
  const state = usePropertyAdminStore.getState();
  
  console.log('Current sidebar state:', state.isSidebarOpen);
  console.log('Selected property:', state.selectedProperty?.name);
  
  // You can also call actions
  state.openSidebar();
  state.setSelectedProperty(null);
}

// ---------------------------------------------------------------------------
// Example 7: Efficient Subscriptions with Selectors
// ---------------------------------------------------------------------------

export function EfficientComponent() {
  // ✅ GOOD: Only re-renders when isSidebarOpen changes
  const isSidebarOpen = usePropertyAdminStore(selectIsSidebarOpen);
  
  // ❌ BAD: Re-renders on ANY store change
  // const { isSidebarOpen } = usePropertyAdminStore();
  
  return (
    <View>
      <Text>Sidebar is {isSidebarOpen ? 'open' : 'closed'}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example 8: Custom Selector
// ---------------------------------------------------------------------------

export function ComponentWithCustomSelector() {
  // Create a custom selector for specific needs
  const hasSelections = usePropertyAdminStore(
    (state) => state.selectedUnits.length > 0 || state.selectedProperty !== null
  );
  
  return (
    <View>
      {hasSelections && <Text>You have active selections</Text>}
    </View>
  );
}
