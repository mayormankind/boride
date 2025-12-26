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
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
