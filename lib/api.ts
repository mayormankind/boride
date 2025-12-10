import axios, { AxiosError, AxiosResponse } from 'axios';
import type { ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to handle axios responses
function handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
  return response.data as ApiResponse<T>;
}

// Helper to handle axios errors
function handleError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const data = error.response?.data as any;
    
    // If we have a structured backend error response
    if (data && (data.message || data.errors)) {
      throw new ApiError(
        data.message || 'An error occurred',
        status,
        data.errors
      );
    }
    
    // Fallback for generic axios errors
    throw new ApiError(
      error.message || 'Network Error',
      status
    );
  }
  
  // Non-axios error
  throw new ApiError('An unexpected error occurred', 500);
}

export const api = {
  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.get<T>(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      handleError(error);
      throw error; // Make TS happy, handleError always throws
    }
  },

  async post<T>(
    endpoint: string,
    data: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.post<T>(endpoint, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async put<T>(
    endpoint: string,
    data: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.put<T>(endpoint, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.delete<T>(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async patch<T>(
    endpoint: string,
    data: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.patch<T>(endpoint, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

// Specific API functions for the app
export const rideApi = {
  requestRide: (data: {
    pickupLocation: string;
    destination: string;
    estimatedFare: number;
  }) => api.post('/rides/request', data),

  acceptRide: (rideId: string, token: string) =>
    api.post(`/rides/${rideId}/accept`, {}, token),

  declineRide: (rideId: string, token: string) =>
    api.post(`/rides/${rideId}/decline`, {}, token),

  startTrip: (rideId: string, token: string) =>
    api.post(`/rides/${rideId}/start`, {}, token),

  endTrip: (rideId: string, actualFare: number, token: string) =>
    api.post(`/rides/${rideId}/complete`, { actualFare }, token),

  getRideHistory: (token: string) => api.get('/rides/history', token),

  getActiveRide: (token: string) => api.get('/rides/active', token),
};

export const userApi = {
  getProfile: (token: string) => api.get('/user/profile', token),

  updateProfile: (data: any, token: string) =>
    api.put('/user/profile', data, token),

  updateAvatar: async (formData: FormData, token: string) => {
    try {
      const response = await axiosInstance.post('/user/avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', 
        },
      });
      return response; 
    } catch (error) {
       handleError(error);
       throw error;
    }
  },

  changePassword: (
    data: { currentPassword: string; newPassword: string },
    token: string
  ) => api.post('/user/change-password', data, token),
};

export const driverApi = {
  setOnlineStatus: (isOnline: boolean, token: string) =>
    api.post('/driver/status', { isOnline }, token),

  getStats: (token: string) => api.get('/driver/stats', token),

  updateVehicleInfo: (data: any, token: string) =>
    api.put('/driver/vehicle', data, token),
};
