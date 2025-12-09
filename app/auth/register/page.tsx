'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentRegisterForm from '@/components/form/StudentRegisterForm';
import RiderRegisterForm from '@/components/form/DriverRegisterForm';
import { GraduationCap, Car } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';

type UserRole = 'student' | 'rider';

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const router = useRouter();
  const [ isSubmitting, setisSubmitting ] = useState(false)

  const handleStudentSubmit = async (data: any) => {
    setisSubmitting(true)
    try{
      await api.post("/student/register",data);
      console.log('Student registration data:', data);
      toast.success('Logged in successfully')
      router.push('/auth/verify');
    }catch(err:any){
      console.log(err.response.data.message)
      toast.error(err.response.data.message)
    }
    setisSubmitting(false)
  };

  const handleRiderSubmit = (data: any) => {
    console.log('Rider registration data:', data);
    router.push('/auth/verify');
    // TODO: Implement rider registration API call
  };

  const studentColor = {
    primary: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
    text: 'text-emerald-600',
    toggle: 'bg-emerald-500',
    overlay: 'from-emerald-900/90 to-green-900/70',
    formBg: 'bg-emerald-50/40',
    accentBorder: 'border-emerald-200',
  };

  const riderColor = {
    primary: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-600',
    toggle: 'bg-blue-500',
    overlay: 'from-blue-900/90 to-indigo-900/70',
    formBg: 'bg-blue-50/40',
    accentBorder: 'border-blue-200',
  };

  const currentColor = selectedRole === 'student' ? studentColor : riderColor;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Left Column */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        initial={false}
      >
        <Image src="/img/left-onboard.svg" alt="Boride Registration" fill className="object-cover" priority />

        {/* Enhanced Content Overlay with gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentColor.overlay} flex items-center justify-center transition-all duration-500`}>
          <div className="text-white text-center px-8 max-w-md">
            <AnimatePresence mode="wait">
              {selectedRole === 'student' ? (
                <motion.div
                  key="student-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.2, 
                      type: 'spring', 
                      stiffness: 200, 
                      damping: 15 
                    }}
                    className="mb-8"
                  >
                    <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
                      <GraduationCap className="w-16 h-16" />
                    </div>
                  </motion.div>
                  <h1 className="text-5xl font-bold mb-6 font-jakarta">Join as a Student</h1>
                  <p className="text-xl text-white/90 max-w-md leading-relaxed">
                    Connect with verified riders for safe and convenient campus transportation. 
                    Your journey starts here.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="rider-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.2, 
                      type: 'spring', 
                      stiffness: 200, 
                      damping: 15 
                    }}
                    className="mb-8"
                  >
                    <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
                      <Car className="w-16 h-16" />
                    </div>
                  </motion.div>
                  <h1 className="text-5xl font-bold mb-6 font-jakarta">Join as a Rider</h1>
                  <p className="text-xl text-white/90 max-w-md leading-relaxed">
                    Start earning by providing safe rides to students. 
                    Be part of our trusted community.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Registration Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 transition-colors duration-500 ${currentColor.formBg}`}>
        <div className="w-full max-w-lg">
          {/* Logo/Brand */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join the BoRide community today</p>
          </motion.div>

          {/* Role Toggle Switch */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative bg-gray-200 rounded-full p-1 flex shadow-sm">
              {/* Sliding Background */}
              <motion.div
                className={`absolute top-1 bottom-1 rounded-full ${currentColor.toggle} transition-colors duration-300 shadow-md`}
                initial={false}
                animate={{
                  left: selectedRole === 'student' ? '4px' : '50%',
                  right: selectedRole === 'student' ? '50%' : '4px',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
              
              {/* Toggle Buttons */}
              <button
                onClick={() => setSelectedRole('student')}
                className={`relative z-10 flex-1 py-3 px-6 rounded-full font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
                  selectedRole === 'student' 
                    ? 'text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                <span>Student</span>
              </button>
              
              <button
                onClick={() => setSelectedRole('rider')}
                className={`relative z-10 flex-1 py-3 px-6 rounded-full font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
                  selectedRole === 'rider' 
                    ? 'text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <Car className="w-5 h-5" />
                <span>Rider</span>
              </button>
            </div>
          </motion.div>

          {/* Form Container with Enhanced Design */}
          <motion.div
            className={`bg-white rounded-md shadow-lg p-6 md:p-8 transition-all duration-500]]`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Role Indicator Accent */}
            <motion.div
              className={`h-1 w-12 rounded-full mb-6 mx-auto transition-colors duration-500 ${currentColor.toggle}`}
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />

            <AnimatePresence mode="wait">
              {selectedRole === 'student' ? (
                <motion.div
                  key="student-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-3 justify-center">
                      <div className={`p-2 rounded-lg ${studentColor.bg}`}>
                        <GraduationCap className={`w-5 h-5 ${studentColor.text}`} />
                      </div>
                      <p className={`text-lg font-bold ${studentColor.text}`}>
                        Student Registration
                      </p>
                    </div>
                  </div>
                  <StudentRegisterForm onSubmit={handleStudentSubmit} isSubmitting={isSubmitting} />
                </motion.div>
              ) : (
                <motion.div
                  key="rider-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-3 justify-center">
                      <div className={`p-2 rounded-lg ${riderColor.bg}`}>
                        <Car className={`w-5 h-5 ${riderColor.text}`} />
                      </div>
                      <p className={`text-lg font-bold ${riderColor.text}`}>
                        Rider Registration
                      </p>
                    </div>
                  </div>
                  <RiderRegisterForm onSubmit={handleRiderSubmit} isSubmitting={isSubmitting} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Already Have Account Link */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className={`font-semibold ${currentColor.text} hover:underline transition-colors duration-300`}
              >
                Sign In
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}