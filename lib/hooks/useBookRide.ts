// Book ride mutation hook
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rideApi } from '../api';

interface BookRidePayload {
  pickupLocation: {
    address: string;
    coordinates: { latitude: number; longitude: number };
  };
  dropoffLocation: {
    address: string;
    coordinates: { latitude: number; longitude: number };
  };
  fare: number;
  paymentMethod: 'Cash' | 'Wallet';
  estimatedDistance: number;
  estimatedDuration: number;
}

export function useBookRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BookRidePayload) => {
      const response = await rideApi.bookRide(payload);
      if (!response.success) {
        throw new Error(response.message || 'Failed to book ride');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate student rides list
      queryClient.invalidateQueries({ queryKey: ['rides', 'student'] });
      // Invalidate wallet balance
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance', { userType: 'student' }] });
    },
  });
}
