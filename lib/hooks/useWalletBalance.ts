// Wallet balance query hook
import { useQuery } from '@tanstack/react-query';
import { walletApi } from '../api';

type UserType = 'student' | 'driver';

export function useWalletBalance(userType: UserType) {
  return useQuery({
    queryKey: ['wallet', 'balance', { userType }],
    queryFn: async () => {
      const response = await walletApi.getWalletBalance(userType);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch wallet balance');
      }
      return response.balance || 0;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Poll every 30 seconds
    refetchOnWindowFocus: true,
  });
}
