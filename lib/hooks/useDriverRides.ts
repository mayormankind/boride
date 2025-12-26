// Driver rides query hook
import { useQuery } from '@tanstack/react-query';
import { rideApi } from '../api';

export function useDriverRides(status?: string) {
  return useQuery({
    queryKey: ['rides', 'driver', { status }],
    queryFn: async () => {
      const response = await rideApi.getDriverRides(status);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch driver rides');
      }
      return {
        rides: response.rides || [],
        count: response.count || 0,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
