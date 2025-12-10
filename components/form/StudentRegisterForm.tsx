//components/form/StudentRegisterForm.tsx   
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Phone, Lock, Mail, GraduationCap, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '../ui/password-input';

const studentSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed'),
  email: z.string().email('Invalid email format').regex(
    /^[a-zA-Z]+[a-zA-Z]\d{4}@student\.babcock\.edu\.ng$/,
    'Email must be Surname+Initial+Last4Digits@student.babcock.edu.ng'
  ),
  // phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits (omit +234)'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must include letter, number, and uppercase character'),
  confirmPassword: z.string(),
  matricNo: z.string().regex(/^\d{2}\/\d{4}$/, 'Matric No must be in format: XX/XXXX (e.g., 04/2025)'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type StudentForm = z.infer<typeof studentSchema>;

export default function StudentRegisterForm({ onSubmit, isSubmitting }: { onSubmit: (data: any) => Promise<void>, isSubmitting: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: StudentForm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = data;
    // Phone is commented out as it is not needed for now
    // const payload = { ...rest, phone: `+234${data.phone}` };
    const payload = { ...rest };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="fullName"
            placeholder="Full name"
            className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
            {...register('fullName')}
          />
        </div>
        {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="email"
            type="email"
            placeholder="Ojomup9338@student.babcock.edu.ng"
            className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
            {...register('email')}
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {/* Matric Number */}
      <div>
        <label htmlFor="matricNo" className="block text-sm font-medium text-gray-700 mb-1">
          Matric Number
        </label>
        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="matricNo"
            placeholder="04/2025"
            className={`pl-10 ${errors.matricNo ? 'border-red-500' : ''}`}
            {...register('matricNo')}
          />
        </div>
        {errors.matricNo && <p className="mt-1 text-sm text-red-500">{errors.matricNo.message}</p>}
      </div>

      {/* Phone */}
      {/* <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-sm">
            +234
          </span>
          <Input
            id="phone"
            type="tel"
            placeholder="8090012345"
            className={`rounded-l-none ${errors.phone ? 'border-red-500' : ''}`}
            {...register('phone')}
          />
        </div>
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
      </div> */}

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <PasswordInput
            id="password"
            type="password"
            placeholder="••••••••"
            className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
            {...register('password')}
          />
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <PasswordInput
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid}
        className="w-full bg-student-primary hover:bg-emerald-600 text-white font-semibold"
      >
        {isSubmitting ? <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Get Started as Student"}
      </Button>
    </form>
  );
}