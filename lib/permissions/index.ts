/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * Provides permission checking functions for vehicle management operations
 */

import type { UserRole } from "@/types";

// ============================================================================
// Permission Definitions
// ============================================================================

/**
 * Check if user can register vehicles
 * Only relocation_driver role can register vehicles
 */
export function canRegisterVehicle(role: UserRole | undefined): boolean {
  return role === "relocation_driver";
}

/**
 * Check if user can access admin screens
 * Only admin and super_admin roles can access admin screens
 */
export function canAccessAdminScreens(role: UserRole | undefined): boolean {
  return role === "admin" || role === "super_admin";
}

/**
 * Check if user can approve/reject vehicles
 * Only admin and super_admin roles can approve/reject
 */
export function canApproveVehicles(role: UserRole | undefined): boolean {
  return role === "admin" || role === "super_admin";
}

/**
 * Check if user can delete any vehicle
 * Only super_admin role can delete any vehicle
 */
export function canDeleteAnyVehicle(role: UserRole | undefined): boolean {
  return role === "super_admin";
}

/**
 * Check if user can edit vehicle
 * Driver can edit their own pending/rejected vehicles
 * Admin and super_admin can edit any vehicle
 */
export function canEditVehicle(
  role: UserRole | undefined,
  verificationStatus: "pending_verification" | "verified" | "rejected",
  isOwner: boolean
): boolean {
  // Admin and super_admin can edit any vehicle
  if (role === "admin" || role === "super_admin") {
    return true;
  }
  
  // Driver can only edit their own pending or rejected vehicles
  if (role === "relocation_driver" && isOwner) {
    return verificationStatus === "pending_verification" || verificationStatus === "rejected";
  }
  
  return false;
}

/**
 * Check if user can delete vehicle
 * Driver can delete their own non-active vehicles
 * Super admin can delete any vehicle
 */
export function canDeleteVehicle(
  role: UserRole | undefined,
  isActive: boolean,
  isOwner: boolean
): boolean {
  // Super admin can delete any vehicle
  if (role === "super_admin") {
    return true;
  }
  
  // Driver can only delete their own non-active vehicles
  if (role === "relocation_driver" && isOwner && !isActive) {
    return true;
  }
  
  return false;
}

/**
 * Check if user can set vehicle as active
 * Only driver can set their own verified vehicles as active
 */
export function canSetActiveVehicle(
  role: UserRole | undefined,
  verificationStatus: "pending_verification" | "verified" | "rejected",
  isActive: boolean,
  isOwner: boolean
): boolean {
  return (
    role === "relocation_driver" &&
    isOwner &&
    verificationStatus === "verified" &&
    !isActive
  );
}

/**
 * Check if user can update vehicle status (available/unavailable)
 * Only driver can update their own active vehicle status
 */
export function canUpdateVehicleStatus(
  role: UserRole | undefined,
  isActive: boolean,
  isOwner: boolean
): boolean {
  return role === "relocation_driver" && isOwner && isActive;
}

/**
 * Get permission error message
 */
export function getPermissionErrorMessage(action: string): string {
  return `You don't have permission to ${action}`;
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    tenant: "Tenant",
    property_owner: "Property Owner",
    property_agent: "Property Agent",
    relocation_driver: "Relocation Driver",
    admin: "Admin",
    super_admin: "Super Admin",
  };
  
  return roleNames[role];
}
