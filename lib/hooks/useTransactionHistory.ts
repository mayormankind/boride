// Transaction history query hook
import { useQuery } from '@tanstack/react-query';
import { walletApi } from '../api';

type UserType = 'student' | 'driver';

export function useTransactionHistory(
  userType: UserType,
  limit: number = 20,
  page: number = 1
) {
  return useQuery({
    queryKey: ['wallet', 'transactions', { userType, limit, page }],
    queryFn: async () => {
      const response = await walletApi.getTransactionHistory(userType, limit, page);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch transactions');
      }
      return {
        transactions: response.transactions || [],
        pagination: response.pagination,
      };
    },
    staleTime: 60 * 1000, // 1 minute
  });
}
