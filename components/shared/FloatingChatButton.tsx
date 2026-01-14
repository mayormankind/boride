"use client";

import { useRouter, usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function FloatingChatButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Don't show the button on the chat page itself
  if (pathname === "/student/chat") {
    return null;
  }

  const handleClick = () => {
    router.push("/student/chat");
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-20 right-6 z-40 group"
      aria-label="Open chat support"
    >
      {/* Main button */}
      <div className="relative">
        <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        <div className="relative w-14 h-14 bg-linear-to-br from-green-500 to-green-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200">
          <MessageCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>

        {/* Notification badge (would be enabled when there are unread messages) */}
        {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-xs text-white font-bold">3</span>
        </div> */}
      </div>

      {/* Tooltip */}
      <div
        className={`absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-200 ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
          Chat with Support
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </div>

      {/* Pulse animation ring */}
      <div className="absolute inset-0 rounded-full">
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
      </div>
    </button>
  );
}
