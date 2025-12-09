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

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'An error occurred',
      response.status,
      data.errors
    );
  }

  return data;
}

export const api = {
  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return handleResponse<T>(response);
  },

  async post<T>(
    endpoint: string,
    data: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  },

  async put<T>(
    endpoint: string,
    data: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return handleResponse<T>(response);
  },

  async patch<T>(
    endpoint: string,
    data: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
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

  updateAvatar: (formData: FormData, token: string) => {
    // Handle file upload separately
    return fetch(`${API_BASE_URL}/user/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
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
