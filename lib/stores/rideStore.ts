//lib/stores/rideStore.ts
import { create } from 'zustand';

export type RideStatus =
  | 'pending'
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

// Simplified RideStore - only for rideHistory if needed in the future
// activeRide is now DERIVED from React Query data, not stored here
interface RideState {
  rideHistory: Ride[];
  addToHistory: (ride: Ride) => void;
}

export const useRideStore = create<RideState>((set) => ({
  rideHistory: [],

  addToHistory: (ride) =>
    set((state) => ({
      rideHistory: [ride, ...state.rideHistory],
    })),
}));
