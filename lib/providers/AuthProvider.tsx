// components/auth/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    fetch('/api/auth/me', {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data?.user ?? null);
      })
      .catch(() => {
        setUser(null);
      });
  }, [setUser]);

  return <>{children}</>;
}
