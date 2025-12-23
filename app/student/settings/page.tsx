'use client';

import { useState } from 'react';
import { Bell, Moon, FileText, Trash2, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function StudentSettingsPage() {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    rideUpdates: true,
    promoOffers: false,
    darkMode: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    // TODO: Save to backend or localStorage
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-student-bg via-white to-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-student-primary to-student-dark p-6 text-white">
        <h1 className="text-2xl font-bold font-jakarta">Settings</h1>
        <p className="text-emerald-100 text-sm mt-1">Customize your app experience</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Notifications */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-student-primary" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle('pushNotifications')}
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Get updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-medium">Ride Updates</p>
                <p className="text-sm text-gray-500">Notifications about your rides</p>
              </div>
              <Switch
                checked={settings.rideUpdates}
                onCheckedChange={() => handleToggle('rideUpdates')}
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-medium">Promotional Offers</p>
                <p className="text-sm text-gray-500">Special deals and promotions</p>
              </div>
              <Switch
                checked={settings.promoOffers}
                onCheckedChange={() => handleToggle('promoOffers')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="w-5 h-5 text-student-primary" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-500">Switch to dark theme</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Legal & Support */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-student-primary" />
              Legal & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-between h-12 hover:bg-gray-100"
            >
              <span>Privacy Policy</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between h-12 hover:bg-gray-100"
            >
              <span>Terms of Service</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between h-12 hover:bg-gray-100"
            >
              <span>Help & Support</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="shadow-lg border-red-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-300 hover:bg-red-50 h-12"
            >
              Delete Account
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              This action cannot be undone
            </p>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center text-sm text-gray-400 py-4">
          <p>BoRide Student App</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
