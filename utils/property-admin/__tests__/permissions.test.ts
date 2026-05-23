/**
 * Property Admin Permissions Tests
 * Unit tests for role-based access control functions
 */

import {
    canAccessAgents,
    canAccessFinance,
    canAccessMarketInsights,
    canAccessTenantDemographics,
    canAddProperty,
    canArchiveProperty,
    canHireAgent,
    canManagePropertyGallery,
    canManageUnitStatus,
    canViewAllAnalytics,
    canViewPerformanceReports,
    getPropertyAdminPermissionError,
} from "../permissions";

describe("Property Admin Permissions", () => {
  describe("canAccessAgents", () => {
    it("should return true for property_owner", () => {
      expect(canAccessAgents("property_owner")).toBe(true);
    });

    it("should return false for property_agent", () => {
      expect(canAccessAgents("property_agent")).toBe(false);
    });

    it("should return false for other roles", () => {
      expect(canAccessAgents("tenant")).toBe(false);
      expect(canAccessAgents("relocation_driver")).toBe(false);
      expect(canAccessAgents("admin")).toBe(false);
      expect(canAccessAgents("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(canAccessAgents(undefined)).toBe(false);
    });
  });

  describe("canAccessFinance", () => {
    it("should return true for property_owner", () => {
      expect(canAccessFinance("property_owner")).toBe(true);
    });

    it("should return false for property_agent", () => {
      expect(canAccessFinance("property_agent")).toBe(false);
    });

    it("should return false for other roles", () => {
      expect(canAccessFinance("tenant")).toBe(false);
      expect(canAccessFinance("relocation_driver")).toBe(false);
      expect(canAccessFinance("admin")).toBe(false);
      expect(canAccessFinance("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(canAccessFinance(undefined)).toBe(false);
    });
  });

  describe("canAccessMarketInsights", () => {
    it("should return true for property_owner", () => {
      expect(canAccessMarketInsights("property_owner")).toBe(true);
    });

    it("should return false for property_agent", () => {
      expect(canAccessMarketInsights("property_agent")).toBe(false);
    });

    it("should return false for other roles", () => {
      expect(canAccessMarketInsights("tenant")).toBe(false);
      expect(canAccessMarketInsights("relocation_driver")).toBe(false);
      expect(canAccessMarketInsights("admin")).toBe(false);
      expect(canAccessMarketInsights("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(canAccessMarketInsights(undefined)).toBe(false);
    });
  });

  describe("canAccessTenantDemographics", () => {
    it("should return true for property_owner", () => {
      expect(canAccessTenantDemographics("property_owner")).toBe(true);
    });

    it("should return false for property_agent", () => {
      expect(canAccessTenantDemographics("property_agent")).toBe(false);
    });

    it("should return false for other roles", () => {
      expect(canAccessTenantDemographics("tenant")).toBe(false);
      expect(canAccessTenantDemographics("relocation_driver")).toBe(false);
      expect(canAccessTenantDemographics("admin")).toBe(false);
      expect(canAccessTenantDemographics("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(canAccessTenantDemographics(undefined)).toBe(false);
    });
  });

  describe("canAddProperty", () => {
    it("should return true for property_owner", () => {
      expect(canAddProperty("property_owner")).toBe(true);
    });

    it("should return false for property_agent", () => {
      expect(canAddProperty("property_agent")).toBe(false);
    });

    it("should return false for other roles", () => {
      expect(canAddProperty("tenant")).toBe(false);
      expect(canAddProperty("relocation_driver")).toBe(false);
      expect(canAddProperty("admin")).toBe(false);
      expect(canAddProperty("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(canAddProperty(undefined)).toBe(false);
    });
  });

  describe("canArchiveProperty", () => {
    it("should return true for property_owner", () => {
      expect(canArchiveProperty("property_owner")).toBe(true);
    });

    it("should return false for property_agent", () => {
      expect(canArchiveProperty("property_agent")).toBe(false);
    });

    it("should return false for other roles", () => {
      expect(canArchiveProperty("tenant")).toBe(false);
      expect(canArchiveProperty("relocation_driver")).toBe(false);
      expect(canArchiveProperty("admin")).toBe(false);
      expect(canArchiveProperty("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(canArchiveProperty(undefined)).toBe(false);
    });
  });

  describe("canHireAgent", () => {
    it("should return true for property_owner", () => {
      expect(canHireAgent("property_owner")).toBe(true);
    });

    it("should return false for property_agent", () => {
      expect(canHireAgent("property_agent")).toBe(false);
    });

    it("should return false for other roles", () => {
      expect(canHireAgent("tenant")).toBe(false);
      expect(canHireAgent("relocation_driver")).toBe(false);
      expect(canHireAgent("admin")).toBe(false);
      expect(canHireAgent("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(canHireAgent(undefined)).toBe(false);
    });
  });

  describe("canManageUnitStatus", () => {
    it("should return true for property_owner", () => {
      expect(canManageUnitStatus("property_owner")).toBe(true);
    });

    it("should return true for property_agent", () => {
      expect(canManageUnitStatus("property_agent")).toBe(true);
    });

    it("should return false for other roles", () => {
      expect(canManageUnitStatus("tenant")).toBe(false);
      expect(canManageUnitStatus("relocation_driver")).toBe(false);
      expect(canManageUnitStatus("admin")).toBe(false);
      expect(canManageUnitStatus("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(canManageUnitStatus(undefined)).toBe(false);
    });
  });

  describe("canManagePropertyGallery", () => {
    it("should return true for property_owner", () => {
      expect(canManagePropertyGallery("property_owner")).toBe(true);
    });

    it("should return true for property_agent", () => {
      expect(canManagePropertyGallery("property_agent")).toBe(true);
    });

    it("should return false for other roles", () => {
      expect(canManagePropertyGallery("tenant")).toBe(false);
      expect(canManagePropertyGallery("relocation_driver")).toBe(false);
      expect(canManagePropertyGallery("admin")).toBe(false);
      expect(canManagePropertyGallery("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(canManagePropertyGallery(undefined)).toBe(false);
    });
  });

  describe("canViewAllAnalytics", () => {
    it("should return true for property_owner", () => {
      expect(canViewAllAnalytics("property_owner")).toBe(true);
    });

    it("should return false for property_agent", () => {
      expect(canViewAllAnalytics("property_agent")).toBe(false);
    });

    it("should return false for other roles", () => {
      expect(canViewAllAnalytics("tenant")).toBe(false);
      expect(canViewAllAnalytics("relocation_driver")).toBe(false);
      expect(canViewAllAnalytics("admin")).toBe(false);
      expect(canViewAllAnalytics("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(canViewAllAnalytics(undefined)).toBe(false);
    });
  });

  describe("canViewPerformanceReports", () => {
    it("should return true for property_owner", () => {
      expect(canViewPerformanceReports("property_owner")).toBe(true);
    });

    it("should return true for property_agent", () => {
      expect(canViewPerformanceReports("property_agent")).toBe(true);
    });

    it("should return false for other roles", () => {
      expect(canViewPerformanceReports("tenant")).toBe(false);
      expect(canViewPerformanceReports("relocation_driver")).toBe(false);
      expect(canViewPerformanceReports("admin")).toBe(false);
      expect(canViewPerformanceReports("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(canViewPerformanceReports(undefined)).toBe(false);
    });
  });

  describe("getPropertyAdminPermissionError", () => {
    it("should return formatted error message", () => {
      const action = "access agents";
      const expected = "Access Denied: You don't have permission to access agents";
      expect(getPropertyAdminPermissionError(action)).toBe(expected);
    });

    it("should handle different actions", () => {
      expect(getPropertyAdminPermissionError("add property")).toBe(
        "Access Denied: You don't have permission to add property"
      );
      expect(getPropertyAdminPermissionError("view finance")).toBe(
        "Access Denied: You don't have permission to view finance"
      );
    });
  });

  describe("Role Permission Hierarchy", () => {
    it("property_owner should have all permissions that property_agent has", () => {
      // Functions where both roles have access
      const sharedPermissions = [
        canManageUnitStatus,
        canManagePropertyGallery,
        canViewPerformanceReports,
      ];

      sharedPermissions.forEach((permissionFn) => {
        const ownerHasAccess = permissionFn("property_owner");
        const agentHasAccess = permissionFn("property_agent");
        
        // If agent has access, owner must also have access
        if (agentHasAccess) {
          expect(ownerHasAccess).toBe(true);
        }
      });
    });

    it("property_owner should have exclusive permissions", () => {
      const ownerOnlyPermissions = [
        canAccessAgents,
        canAccessFinance,
        canAccessMarketInsights,
        canAccessTenantDemographics,
        canAddProperty,
        canArchiveProperty,
        canHireAgent,
        canViewAllAnalytics,
      ];

      ownerOnlyPermissions.forEach((permissionFn) => {
        expect(permissionFn("property_owner")).toBe(true);
        expect(permissionFn("property_agent")).toBe(false);
      });
    });
  });
});
