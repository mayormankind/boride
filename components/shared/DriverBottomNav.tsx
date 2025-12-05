'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, DollarSign, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const driverNavItems: NavItem[] = [
  { name: "Home", href: "/driver", icon: Home },
  { name: "Rides", href: "/driver/rides", icon: Car },
  { name: "Earnings", href: "/driver/earnings", icon: DollarSign },
  { name: "Profile", href: "/driver/profile", icon: User },
];

export default function DriverBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center h-16">
        {driverNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive
                  ? "text-rider-primary"
                  : "text-gray-500 hover:text-rider-primary"
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
