//app/driver/layout.tsx
'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DriverBottomNav from '@/components/shared/DriverBottomNav';

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
      <DriverBottomNav />
    </ProtectedRoute>
  );
}
