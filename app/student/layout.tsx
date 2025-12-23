//app/student/layout.tsx
'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StudentBottomNav from '@/components/shared/StudentBottomNav';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
      <StudentBottomNav />
    </ProtectedRoute>
  );
}
