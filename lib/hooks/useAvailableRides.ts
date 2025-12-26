// Available rides query hook (for drivers)
import { useQuery } from '@tanstack/react-query';
import { rideApi } from '../api';

interface UseAvailableRidesOptions {
  enabled?: boolean;
}

export function useAvailableRides(options?: UseAvailableRidesOptions) {
  return useQuery({
    queryKey: ['rides', 'available'],
    queryFn: async () => {
      const response = await rideApi.getAvailableRides();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch available rides');
      }
      return {
        rides: response.rides || [],
        count: response.count || 0,
      };
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 1000, // 5 seconds - very fresh data needed
    refetchInterval: 10 * 1000, // Poll every 10 seconds
    refetchOnWindowFocus: true,
  });
}
