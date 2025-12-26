// Complete ride mutation hook
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rideApi } from '../api';

interface CompleteRideParams {
  rideId: string;
  actualDistance: number;
  actualDuration: number;
}

export function useCompleteRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rideId, actualDistance, actualDuration }: CompleteRideParams) => {
      const response = await rideApi.completeRide(rideId, { actualDistance, actualDuration });
      if (!response.success) {
        throw new Error(response.message || 'Failed to complete ride');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate multiple related queries
      queryClient.invalidateQueries({ queryKey: ['rides', 'driver'] });
      queryClient.invalidateQueries({ queryKey: ['rides', 'student'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'stats'] });
    },
  });
}
