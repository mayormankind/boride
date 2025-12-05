//components/form/DriverRegisterForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const riderSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+234\d{10}$/, 'Phone must be +234 followed by 10 digits'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must include uppercase, lowercase, and number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RiderForm = z.infer<typeof riderSchema>;

export default function RiderRegisterForm({ onSubmit }: { onSubmit: (data: RiderForm) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<RiderForm>({
    resolver: zodResolver(riderSchema),
    mode: 'onChange',
  });

  const handleFormSubmit = (data: RiderForm) => {
    onSubmit(data);
    reset();
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
            placeholder="Maxima Samuel "
            className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
            {...register('fullName')}
          />
        </div>
        {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="email"
            type="email"
            placeholder="johndoe@example.com"
            className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
            {...register('email')}
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
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
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
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
          <Input
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
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
      >
        Sign Up as Rider
      </Button>
    </form>
  );
}