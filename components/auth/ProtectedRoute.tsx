//components/auth/ProtectedRoute.tsx
'use client';

import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return <>{children}</>;
}
