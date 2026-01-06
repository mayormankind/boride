"use client";

import {
  CheckCircle2,
  Clock,
  Car,
  MapPin,
  XCircle,
  UserCheck,
  Play,
} from "lucide-react";
import type { TimelineEvent } from "@/lib/hooks/useRideDetails";

interface RideTimelineProps {
  timeline: TimelineEvent[];
}

const EVENT_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  requested: {
    icon: <Clock className="w-4 h-4" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  accepted: {
    icon: <UserCheck className="w-4 h-4" />,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  driver_arrived: {
    icon: <Car className="w-4 h-4" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  started: {
    icon: <Play className="w-4 h-4" />,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  completed: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  cancelled: {
    icon: <XCircle className="w-4 h-4" />,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function formatAbsoluteTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function RideTimeline({ timeline }: RideTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-10 h-10 mx-auto mb-2 text-gray-300" />
        <p>No timeline events yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line connecting all events */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-4">
        {timeline.map((event, index) => {
          const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.requested;
          const isLatest = index === timeline.length - 1;

          return (
            <div
              key={`${event.type}-${event.timestamp}`}
              className="relative flex items-start gap-4"
            >
              {/* Icon circle */}
              <div
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${
                  config.bgColor
                } ${config.color} ${
                  isLatest ? "ring-2 ring-offset-2 ring-current" : ""
                }`}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium capitalize ${
                        isLatest ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {event.type.replace("_", " ")}
                    </p>
                    {event.message && (
                      <p className="text-sm text-gray-500 mt-0.5 truncate">
                        {event.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs font-medium text-gray-500">
                      {formatRelativeTime(event.timestamp)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatAbsoluteTime(event.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
