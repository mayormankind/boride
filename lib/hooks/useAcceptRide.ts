// Accept ride mutation hook
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rideApi } from '../api';

interface AcceptRideParams {
  rideId: string;
  estimatedArrival: number;
}

export function useAcceptRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rideId, estimatedArrival }: AcceptRideParams) => {
      const response = await rideApi.acceptRide(rideId, { estimatedArrival });
      if (!response.success) {
        throw new Error(response.message || 'Failed to accept ride');
      }
      return response;
    },
    onMutate: async ({ rideId }) => {
      // Optimistically update available rides
      await queryClient.cancelQueries({ queryKey: ['rides', 'available'] });
      
      const previousData = queryClient.getQueryData(['rides', 'available']);
      
      queryClient.setQueryData(['rides', 'available'], (old: any) => {
        if (!old?.rides) return old;
        return {
          ...old,
          rides: old.rides.filter((r: any) => r._id !== rideId && r.id !== rideId),
          count: Math.max(0, (old.count || 0) - 1),
        };
      });
      
      return { previousData };
    },
    onSuccess: () => {
      // Invalidate driver rides
      queryClient.invalidateQueries({ queryKey: ['rides', 'driver'] });
      // Invalidate available rides
      queryClient.invalidateQueries({ queryKey: ['rides', 'available'] });
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['rides', 'available'], context.previousData);
      }
    },
  });
}
