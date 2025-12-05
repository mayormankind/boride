'use client';

import { useState } from 'react';
import { MapPin, Navigation, Phone, MessageCircle, User, Car, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRideStore } from '@/lib/stores/rideStore';
import StudentBottomNav from '@/components/shared/StudentBottomNav';

const STATUS_CONFIG = {
  pending: { label: 'Searching', color: 'bg-yellow-500' },
  accepted: { label: 'Accepted', color: 'bg-blue-500' },
  'on-the-way': { label: 'Driver on the way', color: 'bg-indigo-500' },
  'in-trip': { label: 'In Progress', color: 'bg-green-500' },
  completed: { label: 'Completed', color: 'bg-gray-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' },
};

export default function StudentRidesPage() {
  const activeRide = useRideStore((state) => state.activeRide);
  const rideHistory = useRideStore((state) => state.rideHistory);
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="min-h-screen bg-gradient-to-br from-student-bg via-white to-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-student-primary to-student-dark p-6 text-white">
        <h1 className="text-2xl font-bold font-jakarta">My Rides</h1>
        <p className="text-emerald-100 text-sm mt-1">Track your current and past rides</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active" className="data-[state=active]:bg-student-primary data-[state=active]:text-white">
              Active Ride
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-student-primary data-[state=active]:text-white">
              Ride History
            </TabsTrigger>
          </TabsList>

          {/* Active Ride Tab */}
          <TabsContent value="active" className="mt-0">
            {activeRide ? (
              <Card className="border-2 border-student-primary shadow-lg">
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

                  {/* Driver Info (if accepted) */}
                  {activeRide.driverId && (
                    <>
                      <div className="border-t pt-4 mb-4">
                        <p className="text-sm font-semibold mb-3 text-gray-700">Driver Information</p>
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-rider-primary text-white">
                              {activeRide.driverName?.charAt(0) || 'D'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold">{activeRide.driverName}</p>
                            <p className="text-sm text-gray-500">{activeRide.driverPhone}</p>
                          </div>
                        </div>

                        {/* Vehicle Info */}
                        {activeRide.vehicleInfo && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Car className="w-4 h-4 text-gray-600" />
                              <p className="font-medium text-sm">
                                {activeRide.vehicleInfo.make} {activeRide.vehicleInfo.model}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600">
                              {activeRide.vehicleInfo.color} • {activeRide.vehicleInfo.plateNumber}
                            </p>
                          </div>
                        )}

                        {/* Contact Buttons */}
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 border-2 border-student-primary text-student-primary hover:bg-student-primary hover:text-white"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-2 border-student-primary text-student-primary hover:bg-student-primary hover:text-white"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>

                      {/* Fare */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600">Estimated Fare</p>
                          <p className="text-2xl font-bold text-student-primary">
                            ₦{activeRide.estimatedFare?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Ride</h3>
                  <p className="text-gray-500 text-sm">
                    You don't have any ongoing ride.
                    <br />
                    Request a ride from the home page!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Ride History Tab */}
          <TabsContent value="history" className="mt-0">
            <div className="space-y-4">
              {rideHistory.length > 0 ? (
                rideHistory.map((ride) => (
                  <Card key={ride.id} className="hover:shadow-md transition-shadow">
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
                        <Badge className={`${STATUS_CONFIG[ride.status]?.color} text-white`}>
                          {STATUS_CONFIG[ride.status]?.label}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(ride.requestedAt).toLocaleDateString()}
                          </div>
                          {ride.driverName && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {ride.driverName}
                            </div>
                          )}
                        </div>
                        <p className="font-bold text-student-primary">
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

      <StudentBottomNav />
    </div>
  );
}
