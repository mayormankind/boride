'use client';

import { useState } from 'react';
import { User, Mail, Phone, GraduationCap, Camera, Lock, LogOut, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/stores/authStore';
import { authApi } from '@/lib/api';
import StudentBottomNav from '@/components/shared/StudentBottomNav';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
  });

  const handleSave = async () => {
    try {
        await authApi.studentUpdateProfile(formData);
        updateUser(formData);
        setIsEditing(false);
    } catch (e) {
        console.error(e);
        // Add toast error here if we had toast imported, 
        // but for now console error is fine or we import toast
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-student-bg via-white to-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-student-primary to-student-dark p-6 text-white">
        <h1 className="text-2xl font-bold font-jakarta">My Profile</h1>
        <p className="text-emerald-100 text-sm mt-1">Manage your account information</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16">
        {/* Profile Picture Card */}
        <Card className="shadow-lg border-0 bg-white mb-6">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                <AvatarImage src={user?.avatar} alt={user?.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-student-primary to-student-dark text-white text-3xl font-bold">
                  {user?.fullName?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-student-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-student-dark transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user?.fullName}</h2>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="shadow-lg mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Personal Information</CardTitle>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="border-student-primary text-student-primary hover:bg-student-primary hover:text-white"
              >
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              {isEditing ? (
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="text-gray-800 font-medium mt-1">{user?.fullName}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <p className="text-gray-800 font-medium mt-1">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            {/* Matric Number (Read-only) */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Matric Number
              </label>
              <p className="text-gray-800 font-medium mt-1">{user?.matricNo || 'Not set'}</p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="text-gray-800 font-medium mt-1">{user?.phone}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-student-primary hover:bg-student-dark"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/student/settings">
              <Button
                variant="outline"
                className="w-full justify-start h-12 hover:bg-student-primary/10"
              >
                <Settings className="w-5 h-5 mr-3 text-student-primary" />
                <span>App Settings</span>
              </Button>
            </Link>
            
            <Button
              variant="outline"
              className="w-full justify-start h-12 hover:bg-orange-50"
              onClick={() => router.push('/student/change-password')}
            >
              <Lock className="w-5 h-5 mr-3 text-orange-500" />
              <span>Change Password</span>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-12 hover:bg-red-50 text-red-600 border-red-300"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <StudentBottomNav />
    </div>
  );
}
