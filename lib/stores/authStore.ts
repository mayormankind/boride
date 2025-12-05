import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'student' | 'driver';
  avatar?: string;
  matricNo?: string; // for students
  vehicleInfo?: {
    make: string;
    model: string;
    plateNumber: string;
    color: string;
  }; // for drivers
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'boride-auth-storage',
    }
  )
);
