"use client";

import * as React from "react"

import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./input";

function PasswordInput({ className, type, ...props }: React.ComponentProps<"input">) {
    const [showPassword, setShowPassword] = React.useState(false);
    
    return (
        <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn("pr-10", className)}
              {...props}
            />

            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center justify-center rounded-r-md p-1.5 hover:bg-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
        </div>
      );
}

export { PasswordInput }
