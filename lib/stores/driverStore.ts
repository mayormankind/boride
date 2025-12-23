import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DriverStats {
  dailyEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalEarnings: number;
  completedTrips: number;
  cancelledTrips: number;
  totalTrips: number;
  rating: number;
  totalRatings: number;
}

interface DriverState {
  isAvailable: boolean;
  stats: DriverStats;
  setAvailability: (status: boolean) => void;
  updateStats: (stats: Partial<DriverStats>) => void;
  resetDailyStats: () => void;
}

const defaultStats: DriverStats = {
  dailyEarnings: 0,
  weeklyEarnings: 0,
  monthlyEarnings: 0,
  totalEarnings: 0,
  completedTrips: 0,
  cancelledTrips: 0,
  totalTrips: 0,
  rating: 5.0,
  totalRatings: 0,
};

export const useDriverStore = create<DriverState>()(
  persist(
    (set) => ({
      isAvailable: false,
      stats: defaultStats,
      setAvailability: (status) => set({ isAvailable: status }),
      updateStats: (newStats) =>
        set((state) => ({
          stats: { ...state.stats, ...newStats },
        })),
      resetDailyStats: () =>
        set((state) => ({
          stats: { ...state.stats, dailyEarnings: 0 },
        })),
    }),
    {
      name: 'boride-driver-storage',
    }
  )
);
