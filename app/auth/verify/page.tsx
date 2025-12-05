'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus next input on key press
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multi-character paste

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
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API call
    alert(`Email verified! Welcome to Boride.`);
    setIsSubmitting(false);
  };

  const isValid = otp.every(digit => digit !== '');

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column - Illustration (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-8 max-w-md">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mb-6"
            >
              <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fff" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-1.99 0-3.91-.63-5.42-1.72l-1.08 1.08c-.39.39-.97.39-1.36 0a.97.97 0 010-1.36l1.08-1.08A10 10 0 0112 17zm0-10c1.99 0 3.91.63 5.42 1.72l1.08-1.08c.39-.39.97-.39 1.36 0 .39.39.39.97 0 1.36l-1.08 1.08A10 10 0 0112 7zm0 10c-1.99 0-3.91-.63-5.42-1.72l-1.08 1.08c-.39.39-.97.39-1.36 0a.97.97 0 010-1.36l1.08-1.08A10 10 0 0112 17zm0-10c1.99 0 3.91.63 5.42 1.72l1.08-1.08c.39-.39.97-.39 1.36 0 .39.39.39.97 0 1.36l-1.08 1.08A10 10 0 0112 7z"/>
                </svg>
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">Verify Your Email</h1>
            <p className="text-lg text-white/90">
              We’ve sent a 6-digit code to your email. Enter it below to complete registration.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Verify Your Email</h1>
            <p className="text-muted-foreground mt-2">
              Enter the 6-digit code sent to your email
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
                    digit ? 'border-primary' : 'border-input'
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
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.644z"></path>
                  </svg>
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
                onClick={() => alert('Resend code')}
              >
                Resend Code
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
    </div>
  );
}