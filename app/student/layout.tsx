//app/student/layout.tsx
"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import StudentBottomNav from "@/components/shared/StudentBottomNav";
import { RideCompletionConfirmation } from "@/components/ride/RideCompletionConfirmation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
      <StudentBottomNav />
      {/* Persistent ride completion confirmation - appears when driver requests completion */}
      <RideCompletionConfirmation />
    </ProtectedRoute>
  );
}
