// Driver stats query hook
import { useQuery } from '@tanstack/react-query';
import { driverApi } from '../api';
import type { DriverStats } from '../types';

export function useDriverStats() {
  return useQuery({
    queryKey: ['driver', 'stats'],
    queryFn: async () => {
      const response = await driverApi.getStats();
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch driver stats');
      }
      return response.data as DriverStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - relatively stable data
    refetchOnWindowFocus: true,
  });
}
