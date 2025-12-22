//app/driver/layout.tsx
'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
