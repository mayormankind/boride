// Fund wallet mutation hook
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '../api';

interface FundWalletParams {
  amount: number;
  paymentReference: string;
}

export function useFundWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: FundWalletParams) => {
      const response = await walletApi.fundWallet(params);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fund wallet');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate wallet balance and transactions for student
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance', { userType: 'student' }] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions', { userType: 'student' }] });
    },
  });
}
