'use client';

import { useState } from 'react';
import { Power, User as UserIcon, Bell, MapPin, Navigation, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/stores/authStore';
import { useDriverStore } from '@/lib/stores/driverStore';
import { useRideStore, type Ride } from '@/lib/stores/rideStore';
import DriverBottomNav from '@/components/shared/DriverBottomNav';

// Mock ride request
const MOCK_RIDE_REQUEST: Ride = {
  id: 'ride-001',
  studentId: 'student-123',
  studentName: 'Jane Akinola',
  studentPhone: '+2348012345678',
  pickupLocation: 'Student Hostel Block A',
  destination: 'Main Campus Library',
  estimatedFare: 1500,
  status: 'pending',
  requestedAt: new Date(),
};

export default function DriverDashboard() {
  const user = useAuthStore((state) => state.user);
  const isOnline = useDriverStore((state) => state.isOnline);
  const setOnlineStatus = useDriverStore((state) => state.setOnlineStatus);
  const stats = useDriverStore((state) => state.stats);
  const setActiveRide = useRideStore((state) => state.setActiveRide);

  const [rideRequest, setRideRequest] = useState<Ride | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  const handleToggleOnline = () => {
    const newStatus = !isOnline;
    setOnlineStatus(newStatus);
    
    if (newStatus) {
      // Simulate receiving a ride request after going online
      setTimeout(() => {
        setRideRequest(MOCK_RIDE_REQUEST);
        setShowRequestDialog(true);
      }, 3000);
    }
  };

  const handleAcceptRide = () => {
    if (rideRequest) {
      const acceptedRide: Ride = {
        ...rideRequest,
        status: 'accepted',
        driverId: user?.id,
        driverName: user?.fullName,
        driverPhone: user?.phone,
        vehicleInfo: user?.vehicleInfo,
        acceptedAt: new Date(),
      };
      setActiveRide(acceptedRide);
      setShowRequestDialog(false);
      setRideRequest(null);
    }
  };

  const handleDeclineRide = () => {
    setShowRequestDialog(false);
    setRideRequest(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rider-bg via-white to-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-rider-primary to-rider-dark p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold font-jakarta">
              Welcome back, {user?.fullName?.split(' ')[0] || 'Driver'}! 👋
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              {isOnline ? 'You are online and ready for rides' : 'Go online to start earning'}
            </p>
          </div>
          <Avatar className="w-14 h-14 border-2 border-white shadow-md">
            <AvatarImage src={user?.avatar} alt={user?.fullName} />
            <AvatarFallback className="bg-white text-rider-primary font-semibold text-lg">
              {user?.fullName?.charAt(0) || 'D'}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Online/Offline Toggle */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center`}>
                  <Power className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {isOnline ? 'You are Online' : 'You are Offline'}
                  </p>
                  <p className="text-xs text-blue-100">
                    {isOnline ? 'Accepting ride requests' : 'Not accepting requests'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isOnline}
                onCheckedChange={handleToggleOnline}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Today's Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Today's Earnings</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                ₦{stats.dailyEarnings.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-rider-primary/10 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-rider-primary" />
                </div>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.completedTrips} rides
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Card */}
        {!isOnline ? (
          <Card className="shadow-lg border-2 border-dashed border-gray-300">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <Power className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">You're Offline</h3>
              <p className="text-gray-500 mb-6">
                Toggle the switch above to go online and start accepting ride requests
              </p>
              <Button
                onClick={handleToggleOnline}
                className="bg-gradient-to-r from-rider-primary to-rider-dark hover:from-rider-dark hover:to-rider-hover text-white px-8"
              >
                <Power className="w-4 h-4 mr-2" />
                Go Online
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-2 border-green-200 bg-green-50">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center animate-pulse">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Waiting for Ride Requests...</h3>
              <p className="text-gray-600">
                You're online and ready to accept rides. We'll notify you when a student requests a ride.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Weekly Performance */}
        <Card className="shadow-lg mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">This Week</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Rides</p>
                <p className="text-2xl font-bold text-rider-primary">{stats.totalTrips}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Earnings</p>
                <p className="text-2xl font-bold text-green-600">₦{stats.weeklyEarnings.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.rating.toFixed(1)}⭐</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ride Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">New Ride Request!</DialogTitle>
            <DialogDescription>You have a new ride request from a student</DialogDescription>
          </DialogHeader>

          {rideRequest && (
            <div className="space-y-4 py-4">
              {/* Student Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-student-primary text-white">
                    {rideRequest.studentName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{rideRequest.studentName}</p>
                  <p className="text-sm text-gray-500">{rideRequest.studentPhone}</p>
                </div>
              </div>

              {/* Route */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-student-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-student-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                    <p className="font-medium">{rideRequest.pickupLocation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Destination</p>
                    <p className="font-medium">{rideRequest.destination}</p>
                  </div>
                </div>
              </div>

              {/* Estimated Fare */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Estimated Fare</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₦{rideRequest.estimatedFare?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleDeclineRide}
                  variant="outline"
                  className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  Decline
                </Button>
                <Button
                  onClick={handleAcceptRide}
                  className="flex-1 bg-gradient-to-r from-rider-primary to-rider-dark hover:from-rider-dark hover:to-rider-hover text-white"
                >
                  Accept Ride
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DriverBottomNav />
    </div>
  );
}
