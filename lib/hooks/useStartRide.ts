// Start ride mutation hook
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rideApi } from '../api';

export function useStartRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rideId: string) => {
      const response = await rideApi.startRide(rideId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to start ride');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate both driver and student rides
      queryClient.invalidateQueries({ queryKey: ['rides', 'driver'] });
      queryClient.invalidateQueries({ queryKey: ['rides', 'student'] });
    },
  });
}
