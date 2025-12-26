// lib/hooks/useWithdrawWallets
// Withdraw wallet mutation hook
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '../api';

interface WithdrawWalletParams {
  amount: number;
  bankDetails: any;
}

export function useWithdrawWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: WithdrawWalletParams) => {
      const response = await walletApi.withdrawFromWallet(params);
      if (!response.success) {
        throw new Error(response.message || 'Failed to withdraw funds');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate wallet balance and transactions for driver
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance', { userType: 'driver' }] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions', { userType: 'driver' }] });
    },
  });
}
