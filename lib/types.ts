// Type definitions for BoRide application

export type UserRole = 'student' | 'driver';

export type RideStatus = 'pending' | 'accepted' | 'on-the-way' | 'in-trip' | 'completed' | 'cancelled';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  matricNo?: string; // for students
  vehicleInfo?: VehicleInfo; // for drivers
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleInfo {
  make: string;
  model: string;
  plateNumber: string;
  color: string;
  year?: number;
}

export interface Ride {
  id: string;
  studentId: string;
  driverId?: string;
  studentName: string;
  studentPhone: string;
  driverName?: string;
  driverPhone?: string;
  vehicleInfo?: VehicleInfo;
  pickupLocation: string;
  destination: string;
  pickupCoords?: Coordinates;
  destinationCoords?: Coordinates;
  status: RideStatus;
  estimatedFare?: number;
  actualFare?: number;
  distance?: number; // in kilometers
  duration?: number; // in minutes
  requestedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SavedLocation {
  id: string;
  userId: string;
  name: string;
  address: string;
  coords?: Coordinates;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  readAt?: Date;
}

export type NotificationType =
  | 'ride_accepted'
  | 'driver_arrived'
  | 'trip_started'
  | 'trip_completed'
  | 'trip_cancelled'
  | 'promo'
  | 'system';

export interface DriverStats {
  dailyEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalEarnings: number;
  completedTrips: number;
  cancelledTrips: number;
  totalTrips: number;
  rating: number;
  totalRatings: number;
  acceptanceRate?: number;
  averageResponseTime?: number; // in seconds
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
