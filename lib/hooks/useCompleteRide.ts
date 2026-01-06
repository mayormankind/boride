// Complete ride mutation hook
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rideApi } from "../api";

interface CompleteRideParams {
  rideId: string;
  actualDistance: number;
  actualDuration: number;
}

export function useCompleteRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      rideId,
      actualDistance,
      actualDuration,
    }: CompleteRideParams) => {
      // Driver now requests completion instead of completing directly
      const response = await rideApi.requestCompletion(rideId, {
        actualDistance,
        actualDuration,
      });
      if (!response.success) {
        throw new Error(response.message || "Failed to complete ride");
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate multiple related queries
      queryClient.invalidateQueries({ queryKey: ["rides", "driver"] });
      queryClient.invalidateQueries({ queryKey: ["rides", "student"] });
      queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
      queryClient.invalidateQueries({ queryKey: ["wallet", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["driver", "stats"] });
    },
  });
}
