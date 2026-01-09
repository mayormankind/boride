"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import { BorideLogo } from "@/components/ui/boride-logo";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const token = params?.token as string;
  const userType =
    (searchParams.get("type") as "student" | "driver") || "student";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error("Invalid token");
      return;
    }

    setIsSubmitting(true);
    try {
      // Backend handles hashing
      await authApi.resetPassword(token, data.password, userType);
      setIsSuccess(true);
      toast.success("Password reset successfully");

      // Delay redirect
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          priority
          width={1000}
          height={1000}
          src="/img/left-onboard.svg"
          alt="BoRide"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col">
          <BorideLogo type="light" />
          <div className="text-white text-center px-8 mt-4">
            <h1 className="text-3xl font-bold mb-4">New Password</h1>
            <p className="text-lg opacity-90">
              Secure your account with a new password.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>

            <div className="text-center lg:text-left">
              <div className="lg:hidden mb-4 flex justify-center">
                <BorideLogo />
              </div>
              <h1 className="text-2xl font-bold">Set New Password</h1>
              <p className="text-muted-foreground mt-2">
                Enter your new password below.
              </p>
            </div>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password */}
              <div>
                <Label htmlFor="password">New Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <PasswordInput
                    id="password"
                    placeholder="••••••••"
                    className={`pl-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="••••••••"
                    className={`pl-10 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className={`w-full ${
                  userType === "student"
                    ? "bg-student-primary hover:bg-student-dark"
                    : "bg-rider-primary hover:bg-rider-dark"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 bg-green-50 p-6 rounded-lg border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">
                Password Reset Successful
              </h3>
              <p className="text-sm text-green-700">
                Your password has been updated. You can now log in with your new
                password.
              </p>
              <Button
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-100 mt-2"
                onClick={() => router.push("/auth/login")}
              >
                Proceed to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
