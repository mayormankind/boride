'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import Image from 'next/image';
import { authApi } from '@/lib/api';
import { BorideLogo } from '@/components/ui/boride-logo';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState<'student' | 'driver'>('student');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(data.email, userType);
      setIsSuccess(true);
      toast.success('Password reset email sent');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to send reset email');
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
            <h1 className="text-3xl font-bold mb-4">Reset Password</h1>
            <p className="text-lg opacity-90">Don't worry, it happens to the best of us.</p>
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
              <h1 className="text-2xl font-bold">Forgot Password?</h1>
              <p className="text-muted-foreground mt-2">
                Enter your email to receive a password reset link.
              </p>
            </div>
          </div>

          {!isSuccess ? (
            <div className="space-y-6">
              <Tabs
                defaultValue="student"
                value={userType}
                onValueChange={(v) => setUserType(v as 'student' | 'driver')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="driver">Driver</TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      placeholder={userType === 'student' ? "student@babcock.edu.ng" : "driver@example.com"}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className={`w-full ${
                    userType === 'student'
                      ? 'bg-student-primary hover:bg-student-dark'
                      : 'bg-rider-primary hover:bg-rider-dark'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-4 bg-green-50 p-6 rounded-lg border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Check your email</h3>
              <p className="text-sm text-green-700">
                If an account exists for <b>{userType}</b> with that email, we have sent password reset instructions.
              </p>
              <Button
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-100 mt-2"
                asChild
              >
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
