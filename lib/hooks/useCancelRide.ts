import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rideApi } from "../api";
import { toast } from "sonner";

interface CancelRidePayload {
  rideId: string;
  reason: string;
}

export function useCancelRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rideId, reason }: CancelRidePayload) => {
      const response = await rideApi.cancelRide(rideId, reason, "student");
      if (!response.success) {
        throw new Error(response.message || "Failed to cancel ride");
      }
      return response.ride;
    },
    onSuccess: (data) => {
      toast.success("Ride cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["ride", data._id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel ride");
    },
  });
}
