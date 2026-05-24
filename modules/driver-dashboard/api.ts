/**
 * Driver Dashboard Module - API Layer
 * 
 * Pure HTTP calls for driver dashboard data.
 * No React dependencies - can be used anywhere.
 */

import { apiClient } from '@/lib/api/client';
import type {
    AcceptMovePayload,
    ActiveMove,
    ApiResponse,
    DashboardData,
    DriverMetrics,
    DriverProfile,
    MoveRequest,
    RejectMovePayload,
    StartMovePayload,
} from './types';

// Mock data import for development
import {
    mockActiveMoves,
    mockDashboardData,
    mockDriverMetrics,
    mockDriverProfile,
    mockUpcomingMoves,
} from '@/constants/data/driver-dashboard';

// Default to mock data in development until the driver backend is available.
const USE_MOCK_DATA = __DEV__ && process.env.EXPO_PUBLIC_USE_MOCK !== 'false';

// Simulate network delay for mock data
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

export const driverDashboardApi = {
  /**
   * Fetch complete dashboard data
   */
  fetchDashboardData: async (): Promise<ApiResponse<DashboardData>> => {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return {
        success: true,
        data: mockDashboardData,
      };
    }
    const response = await apiClient.get<ApiResponse<DashboardData>>('/driver/dashboard');
    return response.data;
  },

  /**
   * Fetch driver profile
   */
  fetchDriverProfile: async (): Promise<ApiResponse<DriverProfile>> => {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return {
        success: true,
        data: mockDriverProfile,
      };
    }
    const response = await apiClient.get<ApiResponse<DriverProfile>>('/driver/profile');
    return response.data;
  },

  /**
   * Fetch driver metrics
   */
  fetchDriverMetrics: async (): Promise<ApiResponse<DriverMetrics>> => {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return {
        success: true,
        data: mockDriverMetrics,
      };
    }
    const response = await apiClient.get<ApiResponse<DriverMetrics>>('/driver/metrics');
    return response.data;
  },

  /**
   * Fetch active moves
   */
  fetchActiveMoves: async (): Promise<ApiResponse<ActiveMove[]>> => {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return {
        success: true,
        data: mockActiveMoves,
      };
    }
    const response = await apiClient.get<ApiResponse<ActiveMove[]>>('/driver/moves/active');
    return response.data;
  },

  /**
   * Fetch upcoming move requests
   */
  fetchUpcomingMoves: async (): Promise<ApiResponse<MoveRequest[]>> => {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return {
        success: true,
        data: mockUpcomingMoves,
      };
    }
    const response = await apiClient.get<ApiResponse<MoveRequest[]>>('/driver/moves/upcoming');
    return response.data;
  },

  /**
   * Accept a move request
   */
  acceptMove: async (payload: AcceptMovePayload): Promise<ApiResponse<MoveRequest>> => {
    if (USE_MOCK_DATA) {
      await mockDelay();
      // Simulate success
      const acceptedMove = mockUpcomingMoves.find((m) => m.id === payload.moveRequestId);
      if (!acceptedMove) {
        throw new Error('Move request not found');
      }
      return {
        success: true,
        data: { ...acceptedMove, status: 'accepted' },
      };
    }
    const response = await apiClient.post<ApiResponse<MoveRequest>>(
      `/driver/moves/${payload.moveRequestId}/accept`,
      payload
    );
    return response.data;
  },

  /**
   * Reject a move request
   */
  rejectMove: async (payload: RejectMovePayload): Promise<ApiResponse<void>> => {
    if (USE_MOCK_DATA) {
      await mockDelay();
      return {
        success: true,
        data: undefined,
      };
    }
    const response = await apiClient.post<ApiResponse<void>>(
      `/driver/moves/${payload.moveRequestId}/reject`,
      payload
    );
    return response.data;
  },

  /**
   * Start an active move
   */
  startMove: async (payload: StartMovePayload): Promise<ApiResponse<ActiveMove>> => {
    if (USE_MOCK_DATA) {
      await mockDelay();
      const activeMove = mockActiveMoves.find((m) => m.id === payload.activeMoveId);
      if (!activeMove) {
        throw new Error('Active move not found');
      }
      return {
        success: true,
        data: { ...activeMove, status: 'in_progress' },
      };
    }
    const response = await apiClient.post<ApiResponse<ActiveMove>>(
      `/driver/moves/${payload.activeMoveId}/start`,
      payload
    );
    return response.data;
  },
};
