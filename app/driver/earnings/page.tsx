//app/driver/earnings/page.tsx
'use client';

import { DollarSign, TrendingUp, Car, XCircle, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDriverStore } from '@/lib/stores/driverStore';

export default function DriverEarningsPage() {
  const stats = useDriverStore((state) => state.stats);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rider-bg via-white to-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-rider-primary to-rider-dark p-6 text-white">
        <h1 className="text-2xl font-bold font-jakarta">Earnings Dashboard</h1>
        <p className="text-blue-100 text-sm mt-1">Track your income and performance</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Total Earnings Card */}
        <Card className="shadow-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 mb-6">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <p className="text-sm text-gray-600 font-medium">Total Earnings</p>
            </div>
            <p className="text-5xl font-bold text-green-700 mb-2">
              ₦{stats.totalEarnings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">All-time earnings</p>
          </CardContent>
        </Card>

        {/* Period Earnings */}
        <Tabs defaultValue="daily" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-0">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rider-primary" />
                  Today's Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-gray-600">Earnings</p>
                    </div>
                    <p className="text-3xl font-bold text-green-700">
                      ₦{stats.dailyEarnings.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-gray-600">Trips</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">
                      {stats.completedTrips}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="mt-0">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-rider-primary" />
                  This Week's Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-gray-600">Earnings</p>
                    </div>
                    <p className="text-3xl font-bold text-green-700">
                      ₦{stats.weeklyEarnings.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-gray-600">Total Trips</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">
                      {stats.totalTrips}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="mt-0">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rider-primary" />
                  This Month's Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-gray-600">Earnings</p>
                    </div>
                    <p className="text-3xl font-bold text-green-700">
                      ₦{stats.monthlyEarnings.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-gray-600">Total Trips</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">
                      {stats.totalTrips}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Statistics Summary */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Overall Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Completed Trips */}
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-green-500 mx-auto mb-3 flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.completedTrips}</p>
                <p className="text-xs text-gray-500 mt-1">Completed</p>
              </div>

              {/* Cancelled Trips */}
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-red-500 mx-auto mb-3 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.cancelledTrips}</p>
                <p className="text-xs text-gray-500 mt-1">Cancelled</p>
              </div>

              {/* Total Trips */}
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-blue-500 mx-auto mb-3 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalTrips}</p>
                <p className="text-xs text-gray-500 mt-1">Total Trips</p>
              </div>

              {/* Rating */}
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-yellow-500 mx-auto mb-3 flex items-center justify-center text-xl">
                  ⭐
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.rating.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Breakdown */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Earnings Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Today</p>
                  <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <p className="font-bold text-green-600">₦{stats.dailyEarnings.toLocaleString()}</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">This Week</p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
              </div>
              <p className="font-bold text-blue-600">₦{stats.weeklyEarnings.toLocaleString()}</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">This Month</p>
                  <p className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <p className="font-bold text-purple-600">₦{stats.monthlyEarnings.toLocaleString()}</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">All Time</p>
                  <p className="text-xs text-gray-500">Total earnings</p>
                </div>
              </div>
              <p className="font-bold text-xl text-green-700">₦{stats.totalEarnings.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
