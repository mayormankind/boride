'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('student' | 'driver')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!token || !user) {
      router.replace('/auth/login');
      return;
    }

    // If roles are specified and user's role is not allowed
    if (allowedRoles && !allowedRoles.includes(user.role as any)) {
      // Redirect to appropriate dashboard based on their actual role
      if (user.role === 'student') {
        router.replace('/student');
      } else if (user.role === 'driver') {
        router.replace('/driver');
      } else {
         router.replace('/auth/login');
      }
    }
  }, [isAuthenticated, user, token, router, allowedRoles]);

  // Show loading or nothing while checking (or just render children if we rely on useEffect to kick them out)
  // Ideally we show a loading spinner until we are sure
  if (!user || !token) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
      );
  }

  // Double check role for rendering
  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
      return null; // or loading
  }

  return <>{children}</>;
}
