/**
 * Property Admin - Role Permission Utilities
 * 
 * Defines permission functions for role-based access control.
 * 
 * Roles:
 * - Property_Owner: Full access to all features
 * - Property_Agent: Limited access (no finance, hiring, or archiving)
 */

export type UserRole = 'Property_Owner' | 'Property_Agent';

/**
 * Check if user can access agents section
 * Property_Owner: Yes
 * Property_Agent: Yes (can view assigned agents)
 */
export function canAccessAgents(role: UserRole): boolean {
  return role === 'Property_Owner' || role === 'Property_Agent';
}

/**
 * Check if user can access finance section
 * Property_Owner: Yes
 * Property_Agent: No
 */
export function canAccessFinance(role: UserRole): boolean {
  return role === 'Property_Owner';
}

/**
 * Check if user can access market insights
 * Property_Owner: Yes
 * Property_Agent: No
 */
export function canAccessMarketInsights(role: UserRole): boolean {
  return role === 'Property_Owner';
}

/**
 * Check if user can access tenant demographics
 * Property_Owner: Yes
 * Property_Agent: No
 */
export function canAccessTenantDemographics(role: UserRole): boolean {
  return role === 'Property_Owner';
}

/**
 * Check if user can add new properties
 * Property_Owner: Yes
 * Property_Agent: No
 */
export function canAddProperty(role: UserRole): boolean {
  return role === 'Property_Owner';
}

/**
 * Check if user can archive properties
 * Property_Owner: Yes
 * Property_Agent: No
 */
export function canArchiveProperty(role: UserRole): boolean {
  return role === 'Property_Owner';
}

/**
 * Check if user can hire agents
 * Property_Owner: Yes
 * Property_Agent: No
 */
export function canHireAgent(role: UserRole): boolean {
  return role === 'Property_Owner';
}

/**
 * Check if user can update unit status
 * Property_Owner: Yes
 * Property_Agent: Yes
 */
export function canUpdateUnitStatus(role: UserRole): boolean {
  return role === 'Property_Owner' || role === 'Property_Agent';
}

/**
 * Check if user can view analytics
 * Property_Owner: Yes (full analytics)
 * Property_Agent: Yes (limited to assigned properties)
 */
export function canViewAnalytics(role: UserRole): boolean {
  return role === 'Property_Owner' || role === 'Property_Agent';
}
