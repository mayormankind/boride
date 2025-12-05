'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading ? (
          /* ================= PRELOADER ================= */
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center z-50 bg-student-primary w-full h-full"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mb-6"
              >
                <div className="relative w-48 h-20 mx-auto drop-shadow-lg">
                  <Image
                    src="/img/boride-white1.png"
                    alt="BoRide Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>

              {/* Loading dots */}
              <motion.div
                className="flex justify-center gap-2 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-white/70 rounded-full"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.25, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.25,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* ================= ONBOARDING SCREEN ================= */
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative min-h-screen flex items-center justify-center p-6"
          >
            {/* Background */}
            <div className="absolute inset-0 -z-10">
              <Image
                src="/img/left-banner.jpg"
                alt="Background"
                fill
                className="object-cover"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-10" />

            {/* CONTENT */}
            <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="mb-6"
              >
                <div className="relative w-44 h-24 mx-auto drop-shadow-xl">
                  <Image
                    src="/img/boride-white1.png"
                    alt="BoRide Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* Text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7 }}
                className="text-xl text-white font-medium mb-3"
              >
                Your Campus Ride, Simplified.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="text-base text-gray-200 max-w-xl mx-auto leading-relaxed"
              >
                Connect with verified student riders and enjoy safe, 
                convenient transportation within campus.
              </motion.p>

              {/* BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center fixed bottom-8 left-0 right-0 px-8 sm:static sm:px-0 mt-10"
              >
                <Link href="/auth/register" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  variant="student"
                  className="w-full sm:w-auto px-8 text-white bg-student-primary font-semibold rounded-xl shadow-md hover:bg-student-primary/90"
                >
                  Get Started
                </Button>
                </Link>

                <Link href="/auth/login" className="flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-10 border-2 text-white border-white"
                  >
                    Login
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
