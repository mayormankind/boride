'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const studentNavItems: NavItem[] = [
  { name: "Home", href: "/student", icon: Home },
  { name: "My Rides", href: "/student/rides", icon: Car },
  { name: "Notifications", href: "/student/notifications", icon: Bell },
  { name: "Profile", href: "/student/profile", icon: User },
];

export default function StudentBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center h-16">
        {studentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive
                  ? "text-student-primary"
                  : "text-gray-500 hover:text-student-primary"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "animate-pulse-scale")} />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
