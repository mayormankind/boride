"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface RideCountdownProps {
  createdAt: string | Date;
  onExpire?: () => void;
}

export function RideCountdown({ createdAt, onExpire }: RideCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const created = new Date(createdAt).getTime();
      const expiresAt = created + 15 * 60 * 1000; // 15 minutes
      const now = new Date().getTime();
      const difference = expiresAt - now;

      if (difference <= 0) {
        setTimeLeft("00:00");
        setIsExpired(true);
        setProgress(0);
        if (onExpire) onExpire();
        return;
      }

      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`,
      );

      // Calculate progress percentage (starts at 100, goes to 0)
      const totalDuration = 15 * 60 * 1000;
      const currentProgress = (difference / totalDuration) * 100;
      setProgress(currentProgress);
    };

    // Calculate immediately
    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [createdAt, onExpire]);

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-sm font-medium">
        <Clock className="w-4 h-4" />
        <span>Request Expired</span>
      </div>
    );
  }

  // Color changes based on time left
  const getColorClass = () => {
    if (progress > 50) return "text-emerald-600 bg-emerald-50";
    if (progress > 20) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getColorClass()}`}
    >
      <Clock className="w-4 h-4 animate-pulse" />
      <span>Finding driver: {timeLeft}</span>
    </div>
  );
}
