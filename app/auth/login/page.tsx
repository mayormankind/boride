'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@/components/ui/password-input';
import { api } from '@/lib/api';
import { BorideLogo } from '@/components/ui/boride-logo';
import { toast } from 'sonner';
import { buildDriverPayload, buildStudentPayload } from '@/lib/helpers';

// Zod Schema
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Required')
    .refine(
      (val) => {
        const isMatric = /^\d{2}\/\d{4}$/.test(val);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        return isMatric || isEmail;
      },
      {
        message: 'Enter a valid email or matric number (e.g., 04/2025)',
      }
    ),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedRole, setDetectedRole] = useState<'student' | 'driver' | null>(
    null
  );

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const identifier = watch('identifier');

  // Role detection
  useEffect(() => {
    if (!identifier) return setDetectedRole(null);

    const isMatric = /^\d{2}\/\d{4}$/.test(identifier);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    if (isMatric) {
      setDetectedRole('student');
    } else if (isEmail) {
      if (identifier.toLowerCase().endsWith('@student.babcock.edu.ng')) {
        setDetectedRole('student');
      } else {
        setDetectedRole('driver');
      }
    } else {
      setDetectedRole(null);
    }
  }, [identifier]);

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
  
    try {
      const payload =
        detectedRole === "student"
          ? buildStudentPayload(data)
          : buildDriverPayload(data);
  
      const url =
        detectedRole === "student"
          ? "/student/login"
          : "/driver/login";
  
      await api.post(url, payload);
  
      toast.success("Logged in successfully");
      router.push(`/${detectedRole}`);
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  
    setIsSubmitting(false);
  };
  

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image priority width={1000} height={1000}
          src="/img/left-onboard.svg"
          alt="Boride Login"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col">
          <BorideLogo type='light'/>
          <div className="text-white text-center px-8">
            <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg">Log in and continue your journey</p>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <BorideLogo/>

            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Log in and pick up right where you left off
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Identifier */}
            <div>
              <Label htmlFor="identifier">Email or Matric Number</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="identifier"
                  placeholder="Ojomup9338@student.babcock.edu.ng or 04/2025"
                  className={`pl-10 ${
                    errors.identifier ? 'border-red-500' : ''
                  }`}
                  {...register('identifier')}
                />
              </div>
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Role hint */}
            {detectedRole && (
              <p className="text-xs text-gray-500 mt-1">
                Logging in as: <span className="font-medium">{detectedRole}</span>
              </p>
            )}

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <PasswordInput
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={!isValid || isSubmitting}
              variant={
                detectedRole === 'student'
                  ? 'student'
                  : detectedRole === 'driver'
                  ? 'rider'
                  : 'default'
              }
              className="w-full"
            >
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don’t have an account?{' '}
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:text-primary/80"
              >
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
