//lib/api.ts
import axios, { AxiosResponse } from "axios";
import type {
  ApiResponse,
  DriverStats,
  StudentRidesResponse,
  StudentStats,
  WalletData,
  WalletTransactionsData,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let storedToken: string | null = null;

// Store token from login response
export const setAuthToken = (token: string) => {
  storedToken = token;
  localStorage.setItem("auth_token", token); // Persist across sessions
};

export const getAuthToken = () => {
  if (!storedToken && typeof window !== "undefined") {
    storedToken = localStorage.getItem("auth_token");
  }
  return storedToken;
};

export const clearAuthToken = () => {
  storedToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
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
        data.message || "An error occurred",
        status,
        data.errors
      );
    }

    // Fallback for generic axios errors
    throw new ApiError(error.message || "Network Error", status);
  }

  // Non-axios error
  throw new ApiError("An unexpected error occurred", 500);
}

// Base API methods
export const api = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.get<T>(endpoint);
      return handleResponse<T>(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.post<T>(endpoint, data);
      return handleResponse<T>(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.put<T>(endpoint, data);
      return handleResponse<T>(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.delete<T>(endpoint);
      return handleResponse<T>(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

// ==================== AUTHENTICATION API ====================
export const authApi = {
  // Student
  studentRegister: (data: any) => api.post("/student/register", data),
  studentLogin: async (data: any) => {
    const res = await api.post<any>("/student/login", data);
    if ((res as any).token) {
      setAuthToken((res as any).token);
    }
    return res;
  },
  studentVerifyEmail: (data: { email: string; otp: string }) =>
    api.post("/student/verify-email", data),
  studentResendOtp: (data: { email: string }) =>
    api.post("/student/resend-otp", data),
  studentUpdateProfile: (data: any) => api.put("/student/profile", data),

  // Driver
  driverRegister: (data: any) => api.post("/driver/register", data),
  driverLogin: async (data: any) => {
    const res = await api.post<any>("/driver/login", data);
    if ((res as any).token) {
      setAuthToken((res as any).token);
    }
    return res;
  },
  driverVerifyEmail: (data: { email: string; otp: string }) =>
    api.post("/driver/verify-email", data),
  driverResendOtp: (data: { email: string }) =>
    api.post("/driver/resend-otp", data),
  driverUpdateProfile: (data: any) => api.put("/driver/profile", data),
  driverToggleAvailability: () => api.put("/driver/availability", {}),

  // Shared Password Reset
  forgotPassword: (email: string, userType: "student" | "driver") =>
    api.post(`/${userType}/forgot-password`, { email }),
  resetPassword: (
    token: string,
    password: string,
    userType: "student" | "driver"
  ) => api.put(`/${userType}/reset-password/${token}`, { password }),

  //shared
  getMe: () => api.get("/auth/me"),
};

// ==================== RIDE API ====================
export const rideApi = {
  // Student
  bookRide: (data: any) => api.post("/student/rides", data),
  getStudentRides: (status?: string) =>
    api.get<StudentRidesResponse>(
      `/student/rides${status ? `?status=${status}` : ""}`
    ),
  getRideDetails: (rideId: string, userType: "student" | "driver") =>
    api.get<any>(`/${userType}/rides/${rideId}`),
  cancelRide: (
    rideId: string,
    reason: string,
    userType: "student" | "driver"
  ) => api.put(`/${userType}/rides/${rideId}/cancel`, { reason }),
  rateRide: (rideId: string, data: { rating: number; review?: string }) =>
    api.put(`/student/rides/${rideId}/rate`, data),
  // Confirmation system
  confirmCompletion: (
    rideId: string,
    data: { action: "confirm" | "reject"; reason?: string }
  ) => api.put(`/student/rides/${rideId}/confirm`, data),
  getPendingConfirmation: () =>
    api.get<any>("/student/rides/pending-confirmation"),

  // Driver
  getAvailableRides: () => api.get<any[]>("/driver/rides/available"),
  getDriverRides: (status?: string) =>
    api.get<any[]>(`/driver/rides${status ? `?status=${status}` : ""}`),
  acceptRide: (rideId: string, data: { estimatedArrival: number }) =>
    api.put(`/driver/rides/${rideId}/accept`, data),
  startRide: (rideId: string) => api.put(`/driver/rides/${rideId}/start`, {}),
  completeRide: (
    rideId: string,
    data: { actualDistance: number; actualDuration: number }
  ) => api.put(`/driver/rides/${rideId}/complete`, data),
  requestCompletion: (
    rideId: string,
    data: { actualDistance: number; actualDuration: number }
  ) => api.put(`/driver/rides/${rideId}/request-completion`, data),
};

// ==================== WALLET API ====================
export const walletApi = {
  getWalletBalance: (userType: "student" | "driver") =>
    api.get<WalletData>(`/${userType}/wallet`),

  getTransactionHistory: (
    userType: "student" | "driver",
    limit = 20,
    page = 1
  ) =>
    api.get<WalletTransactionsData>(
      `/${userType}/wallet/transactions?limit=${limit}&page=${page}`
    ),

  fundWallet: (data: { amount: number; paymentReference: string }) =>
    api.post<WalletData>("/student/wallet/fund", data),

  withdrawFromWallet: (data: { amount: number; bankDetails: any }) =>
    api.post<WalletData>("/driver/wallet/withdraw", data),
};

// ==================== STUDENT API ====================
export const studentApi = {
  getStats: () => api.get<StudentStats>("/student/stats"),
};

export const driverApi = {
  getStats: () => api.get<DriverStats>("/driver/stats"),
};

// Add token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
