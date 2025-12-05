'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentRegisterForm from '@/components/form/StudentRegisterForm';
import RiderRegisterForm from '@/components/form/DriverRegisterForm';
import { GraduationCap, Car } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type UserRole = 'student' | 'rider';

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const handleStudentSubmit = (data: any) => {
    console.log('Student registration data:', data);
  };

  const handleRiderSubmit = (data: any) => {
    console.log('Rider registration data:', data);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Column - Illustration (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/img/boride-login-hero.svg"
          alt="Boride Registration"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-white text-center px-8 max-w-md">
            <AnimatePresence mode="wait">
              {selectedRole === 'student' ? (
                <motion.div
                  key="student"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h1 className="text-3xl font-bold mb-3">Join as a Student</h1>
                  <p className="text-lg text-white/90">
                    Connect with verified riders for safe and convenient campus transportation.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="rider"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
                    <Car className="w-6 h-6" />
                  </div>
                  <h1 className="text-3xl font-bold mb-3">Join as a Rider</h1>
                  <p className="text-lg text-white/90">
                    Start earning by providing safe rides to students.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-between p-6 pb-8 sm:p-12">
        {/* Header */}
        <div className="text-center mb-8 w-full max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            Create Account
          </motion.h2>
          <p className="text-muted-foreground mt-2">
            Join the Boride community today
          </p>
        </div>

        {/* Role Toggle - Clean & Simple */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 w-full max-w-md"
        >
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg border border-border bg-background p-1">
              <button
                onClick={() => setSelectedRole('student')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedRole === 'student'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>
              <button
                onClick={() => setSelectedRole('rider')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedRole === 'rider'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                <Car className="w-4 h-4" />
                Rider
              </button>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {selectedRole === 'student' ? (
              <motion.div
                key="student"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <StudentRegisterForm onSubmit={handleStudentSubmit} />
              </motion.div>
            ) : (
              <motion.div
                key="rider"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <RiderRegisterForm onSubmit={handleRiderSubmit} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Login Link - Fixed Bottom on Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center w-full max-w-md"
        >
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}