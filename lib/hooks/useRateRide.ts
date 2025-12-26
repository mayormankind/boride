// Rate ride mutation hook
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rideApi } from '../api';

interface RateRideParams {
  rideId: string;
  rating: number;
  review?: string;
}

export function useRateRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rideId, rating, review }: RateRideParams) => {
      const response = await rideApi.rateRide(rideId, { rating, review });
      if (!response.success) {
        throw new Error(response.message || 'Failed to rate ride');
      }
      return response;
    },
    onMutate: async ({ rideId, rating, review }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['rides', 'student'] });
      
      const previousData = queryClient.getQueryData(['rides', 'student']);
      
      // Optimistically update the rides list
      queryClient.setQueryData(['rides', 'student'], (old: any) => {
        if (!old?.rides) return old;
        return {
          ...old,
          rides: old.rides.map((r: any) =>
            r._id === rideId ? { ...r, rating, review } : r
          ),
        };
      });
      
      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides', 'student'] });
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['rides', 'student'], context.previousData);
      }
    },
  });
}
