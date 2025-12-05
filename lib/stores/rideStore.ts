import { create } from 'zustand';

export interface Ride {
  id: string;
  studentId: string;
  driverId?: string;
  studentName: string;
  studentPhone: string;
  driverName?: string;
  driverPhone?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    plateNumber: string;
    color: string;
  };
  pickupLocation: string;
  destination: string;
  pickupCoords?: {
    lat: number;
    lng: number;
  };
  destinationCoords?: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'accepted' | 'on-the-way' | 'in-trip' | 'completed' | 'cancelled';
  estimatedFare?: number;
  actualFare?: number;
  requestedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}

interface RideState {
  activeRide: Ride | null;
  rideHistory: Ride[];
  setActiveRide: (ride: Ride | null) => void;
  updateRideStatus: (rideId: string, status: Ride['status']) => void;
  addToHistory: (ride: Ride) => void;
  clearActiveRide: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  activeRide: null,
  rideHistory: [],
  setActiveRide: (ride) => set({ activeRide: ride }),
  updateRideStatus: (rideId, status) =>
    set((state) => ({
      activeRide:
        state.activeRide?.id === rideId
          ? { ...state.activeRide, status }
          : state.activeRide,
    })),
  addToHistory: (ride) =>
    set((state) => ({
      rideHistory: [ride, ...state.rideHistory],
    })),
  clearActiveRide: () => set({ activeRide: null }),
}));
