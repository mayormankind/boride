'use client';

import { useState } from 'react';
import { MapPin, Navigation, Clock, ChevronRight, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRideStore } from '@/lib/stores/rideStore';
import StudentBottomNav from '@/components/shared/StudentBottomNav';

const SAVED_LOCATIONS = [
  { id: '1', name: 'Hostel', address: 'Student Hostel Block A' },
  { id: '2', name: 'Library', address: 'Main Campus Library' },
  { id: '3', name: 'Cafeteria', address: 'Central Cafeteria' },
  { id: '4', name: 'Sports Complex', address: 'Campus Sports Arena' },
];

export default function StudentDashboard() {
  const user = useAuthStore((state) => state.user);
  const rideHistory = useRideStore((state) => state.rideHistory);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading] = useState(false);

  const handleRequestRide = () => {
    if (!pickup || !destination) return;
    // TODO: Implement ride request logic
    console.log('Requesting ride:', { pickup, destination });
  };

  const recentRides = rideHistory.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-student-bg via-white to-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-student-primary to-student-dark p-6 text-white rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold font-jakarta">
              Hello, {user?.fullName?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-emerald-100 text-sm mt-1">Where are you headed today?</p>
          </div>
          <Avatar className="w-14 h-14 border-2 border-white shadow-md">
            <AvatarImage src={user?.avatar} alt={user?.fullName} />
            <AvatarFallback className="bg-white text-student-primary font-semibold text-lg">
              {user?.fullName?.charAt(0) || 'S'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Request Ride Card */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-jakarta flex items-center gap-2">
              <Navigation className="w-5 h-5 text-student-primary" />
              Request a Ride
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pickup Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-student-primary" />
              <Input
                placeholder="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="pl-11 h-12 border-2 focus:border-student-primary"
              />
            </div>

            {/* Destination */}
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
              <Input
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-11 h-12 border-2 focus:border-student-primary"
              />
            </div>

            {/* Request Button */}
            <Button
              onClick={handleRequestRide}
              disabled={!pickup || !destination}
              className="w-full h-12 bg-gradient-to-r from-student-primary to-student-dark hover:from-student-dark hover:to-student-hover text-white font-semibold text-base shadow-md disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300"
            >
              Request Ride
            </Button>
          </CardContent>
        </Card>

        {/* Saved Locations */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3 px-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-student-primary" />
            Saved Locations
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 px-2 hide-scrollbar">
            {SAVED_LOCATIONS.map((location) => (
              <Card
                key={location.id}
                className="flex-shrink-0 w-44 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-student-primary"
                onClick={() => setPickup(location.address)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-student-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{location.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{location.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Rides */}
        <div className="mt-6 mb-4">
          <h2 className="text-lg font-semibold mb-3 px-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-student-primary" />
            Recent Rides
          </h2>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentRides.length > 0 ? (
            <div className="space-y-3">
              {recentRides.map((ride) => (
                <Card key={ride.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <p className="font-medium text-sm">{ride.pickupLocation}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-emerald-600" />
                          <p className="font-medium text-sm">{ride.destination}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(ride.requestedAt).toLocaleDateString()} • ₦{ride.actualFare || ride.estimatedFare}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent rides</p>
                <p className="text-sm text-gray-400 mt-1">Request your first ride to get started</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <StudentBottomNav />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
