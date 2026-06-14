'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function StudentChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.studentChangePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Password changed successfully');
      router.push('/student/profile');
    } catch (e: any) {
      toast.error(e.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShow = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-student-bg via-white to-gray-50 pb-20">
      <div className="bg-gradient-to-r from-student-primary to-student-dark p-6 text-white flex items-center gap-3">
        <button onClick={() => router.back()} className="hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-jakarta">Change Password</h1>
          <p className="text-emerald-100 text-sm mt-1">Update your account password</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-student-primary" />
              Update Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Current Password</label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Enter new password (min 6 characters)"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}

              <Button
                type="submit"
                disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                className="w-full bg-student-primary hover:bg-student-dark h-12"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                {isLoading ? 'Updating...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
