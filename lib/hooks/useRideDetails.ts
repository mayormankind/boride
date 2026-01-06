/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { rideApi } from "@/lib/api";

export interface TimelineEvent {
  type:
    | "requested"
    | "accepted"
    | "driver_arrived"
    | "started"
    | "completed"
    | "cancelled";
  message: string;
  timestamp: string;
}

export interface RideDetails {
  id: string;
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
      color?: string;
      plateNumber?: string;
    };
  };
  pickupLocation: {
    address: string;
    coordinates: { latitude: number; longitude: number };
  };
  dropoffLocation: {
    address: string;
    coordinates: { latitude: number; longitude: number };
  };
  fare: number;
  paymentMethod: "Cash" | "Wallet";
  status: "pending" | "accepted" | "ongoing" | "completed" | "cancelled";
  estimatedDistance?: number;
  estimatedDuration?: number;
  actualDistance?: number;
  actualDuration?: number;
  createdAt: string;
  startTime?: string;
  endTime?: string;
  timeline: TimelineEvent[];
  rating?: number;
  review?: string;
}

interface UseRideDetailsOptions {
  rideId: string;
  userType: "student" | "driver";
}

export function useRideDetails({ rideId, userType }: UseRideDetailsOptions) {
  return useQuery<RideDetails>({
    queryKey: ["ride", rideId],
    queryFn: async () => {
      const response = await rideApi.getRideDetails(rideId, userType);
      if (!response.success) {
        throw new Error(
          (response as any).message || "Failed to fetch ride details"
        );
      }
      // The backend returns { success: true, ride: {...} }
      return (response as any).ride || ((response as any).data as RideDetails);
    },
    enabled: !!rideId,
    // Auto-refetch every 10 seconds for active rides, stop for completed/cancelled
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 10000;
      if (data.status === "completed" || data.status === "cancelled") {
        return false;
      }
      return 10000;
    },
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}
