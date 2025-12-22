// lib/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'student' | 'driver';
  avatar?: string;
  matricNo?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    plateNumber: string;
    color: string;
  };
}

interface AuthState {
  user: User | null;
  loading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,

      setUser: (user) =>
        set({
          user,
          loading: false,
        }),

      logout: () =>
        set({
          user: null,
          loading: false,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'boride-auth',
      partialize: (state) => ({
        user: state.user, // persist user only
      }),
    }
  )
);
