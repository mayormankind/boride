'use client';

import { useState, useEffect, useRef } from 'react';
import { Power, User as UserIcon, Bell, MapPin, Navigation, DollarSign, Loader2Icon } from 'lucide-react';
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
import { authApi, rideApi, walletApi } from '@/lib/api';
import { toast } from 'sonner';

export default function DriverDashboard() {
  const user = useAuthStore((state) => state.user);
  const { isOnline, setOnlineStatus, stats, updateStats } = useDriverStore();
  const { activeRide, setActiveRide, clearActiveRide } = useRideStore();

  const [availableRides, setAvailableRides] = useState<any[]>([]);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  // Polling for available rides
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchAvailableRides = async () => {
      if (isOnline && !activeRide) {
        try {
          const res = await rideApi.getAvailableRides();
          if (res.success && res.count > 0) {
            setAvailableRides(res.rides);
            // Auto-prompt the first one if no dialog is open
            if (!showRequestDialog && !currentRequest) {
                setCurrentRequest(res.rides[0]);
                setShowRequestDialog(true);
            }
          }
        } catch (error) {
          console.error("Error fetching available rides", error);
        }
      }
    };

    const fetchWallet = async () => {
      try {
        const res = await walletApi.getWalletBalance('driver');
        if(res.success) setWalletBalance(res.balance);
      } catch(e) {}
    }

    if (isOnline) {
      fetchAvailableRides(); // Initial fetch
      fetchWallet();
      interval = setInterval(fetchAvailableRides, 10000); // Poll every 10s
    }

    return () => clearInterval(interval);
  }, [isOnline, activeRide, showRequestDialog, currentRequest]);

  const handleToggleOnline = async () => {
    setIsLoading(true);
    try {
        const res = await authApi.driverToggleAvailability();
        if (res.success) {
            const newStatus = !isOnline;
            setOnlineStatus(newStatus);
            toast.success(newStatus ? "You are now Online" : "You are now Offline");
        }
    } catch (error: any) {
        toast.error(error.message || "Failed to toggle status");
    } finally {
        setIsLoading(false);
    }
  };

  const handleAcceptRide = async () => {
    if (!currentRequest) return;
    setIsLoading(true);
    try {
        // Mock estimated arrival for now (5 mins)
        const res = await rideApi.acceptRide(currentRequest._id || currentRequest.id, { estimatedArrival: 5 });
        if (res.success) {
            toast.success("Ride accepted!");
            setActiveRide(res.ride); // Update store with accepted ride
            setShowRequestDialog(false);
            setCurrentRequest(null);
        } else {
            toast.error(res.message || "Failed to accept ride");
        }
    } catch (error: any) {
        toast.error(error.message || "Error accepting ride");
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeclineRide = () => {
    // Just close dialog and maybe ignore this ID for a while in local state
    setShowRequestDialog(false);
    setCurrentRequest(null);
    // In real app, maybe inform backend to ignore
  };

  const handleStartRide = async () => {
      if(!activeRide) return;
      try {
          const res = await rideApi.startRide(activeRide.id || (activeRide as any)._id);
          if(res.success) {
              toast.success("Ride started");
              setActiveRide(res.ride);
          }
      } catch (error: any) {
          toast.error(error.message || "Failed to start ride");
      }
  };

  const handleCompleteRide = async () => {
    if(!activeRide) return;
    try {
        // Mock distance/duration
        const res = await rideApi.completeRide(activeRide.id || (activeRide as any)._id, { actualDistance: 3, actualDuration: 20 });
        if(res.success) {
            toast.success("Ride completed. Payment credited.");
            clearActiveRide();
            // Refresh wallet
            const bRes = await walletApi.getWalletBalance('driver');
            if(bRes.success) setWalletBalance(bRes.balance);
        }
    } catch (error: any) {
        toast.error(error.message || "Failed to complete ride");
    }
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
                disabled={isLoading}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Wallet & Stats Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Wallet Balance</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                ₦{walletBalance.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-rider-primary/10 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-rider-primary" />
                </div>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stats?.rating?.toFixed(1) || '5.0'}⭐
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Ride Control or Status */}
        {activeRide ? (
            <Card className="shadow-lg border-2 border-blue-200 bg-blue-50 mb-6">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4 text-blue-800">Current Ride</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                             <span className="text-gray-600">Passenger</span>
                             <span className="font-semibold">{activeRide.studentName || 'Student'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-gray-600">Route</span>
                             <span className="font-semibold text-right">{activeRide.pickupLocation} <br/>to {activeRide.destination}</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-gray-600">Status</span>
                             <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm uppercase font-bold">{activeRide.status}</span>
                        </div>

                        <div className="pt-4 flex gap-3">
                            {activeRide.status === 'accepted' && (
                                <Button onClick={handleStartRide} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                                    Start Trip
                                </Button>
                            )}
                            {activeRide.status === 'in-trip' && (
                                <Button onClick={handleCompleteRide} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                                    Complete Trip
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        ) : (
            <>
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
                        You're online and ready to accept rides. 
                        {availableRides.length > 0 ? ` (${availableRides.length} available)` : ''}
                    </p>
                    </CardContent>
                </Card>
                )}
            </>
        )}

      </div>

      {/* Ride Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">New Ride Request!</DialogTitle>
            <DialogDescription>You have a new ride request</DialogDescription>
          </DialogHeader>

          {currentRequest && (
            <div className="space-y-4 py-4">
              {/* Student Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-student-primary text-white">
                    {currentRequest.student.fullName?.[0] || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{currentRequest.student.fullName || 'Student'}</p>
                  <p className="text-sm text-gray-500">{currentRequest.student.phoneNo || 'No phone'}</p>
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
                    <p className="font-medium">{currentRequest.pickupLocation?.address || currentRequest.pickupLocation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Destination</p>
                    <p className="font-medium">{currentRequest.dropoffLocation?.address || currentRequest.destination}</p>
                  </div>
                </div>
              </div>

              {/* Estimated Fare */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Estimated Fare</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₦{currentRequest.fare?.toLocaleString() || currentRequest.estimatedFare?.toLocaleString()}
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
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-rider-primary to-rider-dark hover:from-rider-dark hover:to-rider-hover text-white"
                >
                  {isLoading ? <Loader2Icon className="animate-spin mr-2"/> : "Accept Ride"}
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
