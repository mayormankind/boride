'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { BorideLogo } from '@/components/ui/boride-logo';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';

function VerifyForm() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const stored = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("pendingVerification") || "{}") : {};
  const email = searchParams.get('email') || stored.email || "";
  const role = searchParams.get('role') || stored.role || "";

  const [resending, setResending] = useState(false);

  // Focus next input on key press
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every(digit => digit !== '')) {
      document.getElementById('verify-button')?.click();
    }
  };

  // Handle backspace to go to previous input
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) {
        toast.error("Missing email or role information");
        return;
    }

    setIsSubmitting(true);
    try{
      const otpCode = otp.join("");
      let res;
      if (role === 'student') {
        res = await authApi.studentVerifyEmail({ email, otp: otpCode });
      } else {
        res = await authApi.driverVerifyEmail({ email, otp: otpCode });
      }
      
      toast.success(res.message || 'Verification successful');
      router.push('/auth/login');
    }catch(err:any){
      console.log(err);
      toast.error(err.response?.data?.message || err.message || "Verification failed");
    }
    setIsSubmitting(false);
  };

  const handleResend = async () => {
    if (!email || !role) return toast.error("Missing email or role");
    setResending(true);
    try {
        if (role === 'student') {
            await authApi.studentResendOtp({ email });
        } else {
            await authApi.driverResendOtp({ email });
        }
        toast.success("OTP resent successfully");
    } catch (err: any) {
        toast.error(err.message || "Failed to resend OTP");
    }
    setResending(false);
  };

  const isValid = otp.every(digit => digit !== '');

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          <BorideLogo/>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Verify Your Email</h1>
            <p className="text-muted-foreground mt-2">
              Enter the 6-digit code sent to {email || 'your email'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-xl font-medium border rounded-lg ${
                    digit ? 'border-primary' : 'border-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  style={{
                    caretColor: 'transparent',
                    WebkitTextFillColor: 'currentColor',
                    MozAppearance: 'textfield',
                  }}
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              id="verify-button"
              type="submit"
              disabled={!isValid || isSubmitting}
              size="lg"
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"/>
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>

            {/* Resend Link */}
            <div className="text-center text-sm text-muted-foreground">
              Didn’t receive the code?{' '}
              <button
                type="button"
                className="font-medium text-primary hover:text-primary/80 underline"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? 'Resending...' : 'Resend Code'}
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center text-sm text-muted-foreground">
              Already verified?{' '}
              <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column - Illustration (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image priority width={1000} height={1000}
          src="/img/left-onboard.svg"
          alt="Boride Login"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col">
          <BorideLogo type="light"/>
          <div className="text-[#ffe345] text-center px-8 max-w-md">
            <h1 className="text-3xl font-bold mb-4">Verify Your Email</h1>
            <p className="text-lg text-[#ffe345]/90">
              We’ve sent a 6-digit code to your email. Enter it below to complete registration.
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
         <VerifyForm />
      </Suspense>
    </div>
  );
}