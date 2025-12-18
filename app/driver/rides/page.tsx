'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Play, Square, CheckCircle, Calendar, User, Car as CarIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRideStore } from '@/lib/stores/rideStore';
import { useDriverStore } from '@/lib/stores/driverStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { rideApi } from '@/lib/api';
import DriverBottomNav from '@/components/shared/DriverBottomNav';

import { toast } from 'sonner';
import { mapBackendRideToStoreRide } from '@/lib/mapper';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-500' },
  accepted: { label: 'Accepted', color: 'bg-blue-500' },
  'on-the-way': { label: 'On the way', color: 'bg-indigo-500' },
  'in-trip': { label: 'In Progress', color: 'bg-green-500' },
  completed: { label: 'Completed', color: 'bg-gray-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' },
};

export default function DriverRidesPage() {
  const token = useAuthStore((state) => state.token);
  const activeRide = useRideStore((state) => state.activeRide);
  const rideHistory = useRideStore((state) => state.rideHistory);
  const setActiveRide = useRideStore((state) => state.setActiveRide);
  const updateRideStatus = useRideStore((state) => state.updateRideStatus);
  const clearActiveRide = useRideStore((state) => state.clearActiveRide);
  const addToHistory = useRideStore((state) => state.addToHistory);

  const updateStats = useDriverStore((state) => state.updateStats);
  const stats = useDriverStore((state) => state.stats);

  const [localHistory, setLocalHistory] = useState<any[]>([]);

  useEffect(() => {
    if(token) {
        rideApi.getDriverRides(token).then(res => {
            if(res.success) {
                setLocalHistory(res.rides.map(mapBackendRideToStoreRide));

                const current = (res.rides).find((r: any) => ['accepted', 'on-the-way', 'in-trip'].includes(r.status));
                if(current && !activeRide) {
                     setActiveRide(mapBackendRideToStoreRide(current));
                }
            }
        });
    }
  }, [token]);

  const [activeTab, setActiveTab] = useState('active');

  const handleStartTrip = async () => {
    if (activeRide && token) {
      try {
          const res = await rideApi.startRide(activeRide.id, token);
          if (res.success) {
            updateRideStatus(activeRide.id, 'in-trip');
            toast.success("Ride started");
          } else {
             toast.error(res.message || "Failed to start ride");
          }
      } catch (e: any) {
          toast.error(e.message || "Error starting ride");
      }
    }
  };

  const handleEndTrip = async () => {
    if (activeRide && token) {
      try {
          // Mocking distance/duration for now as we don't have GPS tracking implemented here
          const res = await rideApi.completeRide(activeRide.id, { actualDistance: 5, actualDuration: 15 }, token);
          if (res.success) {
               // Update stats locally or re-fetch?
               // Let's rely on the store update that we do manually for immediate feedback
               // or better yet, fetch fresh stats?
               
              updateStats({
                completedTrips: stats.completedTrips + 1,
                dailyEarnings: stats.dailyEarnings + (activeRide.estimatedFare || 0),
                weeklyEarnings: stats.weeklyEarnings + (activeRide.estimatedFare || 0),
                monthlyEarnings: stats.monthlyEarnings + (activeRide.estimatedFare || 0),
                totalEarnings: stats.totalEarnings + (activeRide.estimatedFare || 0),
                totalTrips: stats.totalTrips + 1,
              });

              addToHistory({
                ...activeRide,
                status: 'completed',
                completedAt: new Date(),
                actualFare: activeRide.estimatedFare
              });
              clearActiveRide();
              toast.success("Ride completed!");
          } else {
              toast.error(res.message || "Failed to complete ride");
          }
      } catch (e: any) {
          toast.error(e.message || "Error completing ride");
      }
    }
  };

  const handleNavigate = () => {
    if (activeRide && activeRide.status === 'accepted') {
      updateRideStatus(activeRide.id, 'on-the-way');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rider-bg via-white to-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-rider-primary to-rider-dark p-6 text-white">
        <h1 className="text-2xl font-bold font-jakarta">My Rides</h1>
        <p className="text-blue-100 text-sm mt-1">Manage your current and past rides</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active" className="data-[state=active]:bg-rider-primary data-[state=active]:text-white">
              Active Ride
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-rider-primary data-[state=active]:text-white">
              Ride History
            </TabsTrigger>
          </TabsList>

          {/* Active Ride Tab */}
          <TabsContent value="active" className="mt-0">
            {activeRide ? (
              <Card className="border-2 border-rider-primary shadow-lg">
                <CardContent className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${STATUS_CONFIG[activeRide.status]?.color} text-white px-3 py-1`}>
                      {STATUS_CONFIG[activeRide.status]?.label}
                    </Badge>
                    <p className="text-sm text-gray-500">
                      Ride ID: #{activeRide.id.slice(0, 8)}
                    </p>
                  </div>

                  {/* Student Info */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-student-primary text-white">
                        {activeRide.studentName?.charAt(0) || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{activeRide.studentName}</p>
                      <p className="text-sm text-gray-500">{activeRide.studentPhone}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-rider-primary text-rider-primary hover:bg-rider-primary hover:text-white"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Route Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-student-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-student-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                        <p className="font-medium">{activeRide.pickupLocation}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
                        <Navigation className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Destination</p>
                        <p className="font-medium">{activeRide.destination}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Link */}
                  {activeRide.status === 'accepted' && (
                    <Button
                      onClick={handleNavigate}
                      variant="outline"
                      className="w-full mb-4 border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigate to Pickup Location
                    </Button>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {(activeRide.status === 'accepted' || activeRide.status === 'on-the-way') && (
                      <Button
                        onClick={handleStartTrip}
                        className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Trip
                      </Button>
                    )}

                    {activeRide.status === 'in-trip' && (
                      <Button
                        onClick={handleEndTrip}
                        className="w-full h-12 bg-gradient-to-r from-rider-primary to-rider-dark hover:from-rider-dark hover:to-rider-hover text-white font-semibold"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        End Trip
                      </Button>
                    )}
                  </div>

                  {/* Fare */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600">Estimated Fare</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₦{activeRide.estimatedFare?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Ride</h3>
                  <p className="text-gray-500 text-sm">
                    You don't have any ongoing ride.
                    <br />
                    Go online to start accepting ride requests!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Ride History Tab */}
          <TabsContent value="history" className="mt-0">
            <div className="space-y-4">
              {localHistory.length > 0 ? (
                localHistory.map((ride) => (
                  <Card key={ride._id || ride.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <p className="font-medium text-sm">{ride.pickupLocation}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <p className="font-medium text-sm">{ride.destination}</p>
                          </div>
                        </div>
                        <Badge className={`${STATUS_CONFIG[ride.status as keyof typeof STATUS_CONFIG]?.color || 'bg-gray-500'} text-white`}>
                          {STATUS_CONFIG[ride.status as keyof typeof STATUS_CONFIG]?.label || ride.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(ride.requestedAt).toLocaleDateString()}
                          </div>
                          {ride.studentName && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {ride.studentName}
                            </div>
                          )}
                        </div>
                        <p className="font-bold text-green-600">
                          ₦{(ride.actualFare || ride.estimatedFare)?.toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Ride History</h3>
                    <p className="text-gray-500 text-sm">
                      Your completed rides will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DriverBottomNav />
    </div>
  );
}
