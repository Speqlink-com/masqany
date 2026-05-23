// Property Admin Module - Public API
// This file re-exports all public APIs from the property admin module

// Re-export all types
export * from './types';

// Re-export API
export { propertyAdminApi } from './api';

// Re-export hooks and query keys
export {
    propertyAdminKeys, useAgents, useAnalytics, useArchiveProperty, useCreateProperty, useHireAgent, useProperties,
    useProperty,
    usePropertyUnits, useUpdateUnitStatus
} from './hooks';

// Re-export store and selectors
export {
    selectIsSidebarOpen,
    selectIsStatusModalOpen,
    selectSelectedProperty,
    selectSelectedUnit,
    selectSelectedUnits, usePropertyAdminStore
} from './store';

