//lib/stores/rideStore.ts
import { create } from 'zustand';

export type RideStatus =
  | 'pending'
  | 'accepted'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export interface Ride {
  id: string;
  _id: string;

  student?: {
    id: string;
    fullName: string;
    phoneNo: string;
  };

  driver?: {
    id: string;
    fullName: string;
    phoneNo: string;
    vehicleInfo?: {
      make?: string;
      model?: string;
      plateNumber?: string;
      color?: string;
    };
  };

  pickupLocation: {
    address: string;
    coords?: {
      lat: number;
      lng: number;
    };
  };

  dropoffLocation: {
    address: string;
    coords?: {
      lat: number;
      lng: number;
    };
  };

  fare: number;
  paymentMethod: 'Cash' | 'Wallet';
  status: RideStatus;

  estimatedDistance?: number;
  estimatedDuration?: number;
  actualDistance?: number;
  actualDuration?: number;

  createdAt?: string;
  startTime?: string;
  endTime?: string;
}

interface RideState {
  activeRide: Ride | null;
  rideHistory: Ride[];
  setActiveRide: (ride: Ride | null) => void;
  updateRideStatus: (status: RideStatus) => void;
  addToHistory: (ride: Ride) => void;
  clearActiveRide: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  activeRide: null,
  rideHistory: [],

  setActiveRide: (ride) => set({ activeRide: ride }),

  updateRideStatus: (status) =>
    set((state) => ({
      activeRide: state.activeRide
        ? { ...state.activeRide, status }
        : null,
    })),

  addToHistory: (ride) =>
    set((state) => ({
      rideHistory: [ride, ...state.rideHistory],
    })),

  clearActiveRide: () => set({ activeRide: null }),
}));
