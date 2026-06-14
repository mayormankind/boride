// Student rides query hook
import { useQuery } from '@tanstack/react-query';
import { rideApi } from '../api';

export function useStudentRides(status?: string) {
  return useQuery({
    queryKey: ['rides', 'student', { status }],
    queryFn: async () => {
      const response = await rideApi.getStudentRides(status);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch student rides');
      }
      return {
        rides: response.rides || [],
        count: response.count || 0,
      };
    },
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 15 * 1000, // Poll every 15 seconds for live status updates
    refetchOnWindowFocus: true,
  });
}
