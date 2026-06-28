/**
 * Role-based permissions
 * Defines what each user role can do
 */

export type UserRole = 'tenant' | 'property_owner' | 'property_agent' | 'relocation_driver' | 'admin' | 'superadmin' | 'super_admin';

/**
 * Check if user can register properties
 * Allowed: property_owner, property_agent
 */
export function canRegisterProperty(role: UserRole): boolean {
  return role === 'property_owner' || role === 'property_agent';
}

/**
 * Check if user can register vehicles
 * Allowed: relocation_driver
 */
export function canRegisterVehicle(role: UserRole): boolean {
  return role === 'relocation_driver';
}

/**
 * Check if user can access property admin features
 * Allowed: property_owner, property_agent
 */
export function canAccessPropertyAdmin(role: UserRole): boolean {
  return role === 'property_owner' || role === 'property_agent';
}

/**
 * Check if user can access driver features
 * Allowed: relocation_driver
 */
export function canAccessDriverFeatures(role: UserRole): boolean {
  return role === 'relocation_driver';
}

/**
 * Check if user can access admin features
 * Allowed: admin, superadmin, super_admin
 */
export function canAccessAdmin(role: UserRole): boolean {
  return role === 'admin' || role === 'superadmin' || role === 'super_admin';
}

/**
 * Get error message for permission denial
 */
export function getPermissionErrorMessage(action: string): string {
  return `You don't have permission to ${action}`;
}

/**
 * Get user-friendly role name
 */
export function getRoleName(role: UserRole): string {
  switch (role) {
    case 'tenant':
      return 'Tenant';
    case 'property_owner':
      return 'Property Owner';
    case 'property_agent':
      return 'Property Agent';
    case 'relocation_driver':
      return 'Driver';
    case 'admin':
    case 'superadmin':
    case 'super_admin':
      return 'Administrator';
    default:
      return 'User';
  }
}

/**
 * Get required role for an action (for error messages)
 */
export function getRequiredRolesForAction(action: 'register_property' | 'register_vehicle' | 'access_admin'): string[] {
  switch (action) {
    case 'register_property':
      return ['Property Owner', 'Property Agent'];
    case 'register_vehicle':
      return ['Driver'];
    case 'access_admin':
      return ['Administrator'];
    default:
      return [];
  }
}
