// app/driver/rides/page.tsx
"use client";

import { useState } from "react";
import {
  MapPin,
  Navigation,
  Phone,
  Play,
  CheckCircle,
  Calendar,
  User,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { RideStatus, STATUS_CONFIG } from "@/lib/helpers";

import { toast } from "sonner";
import NoActiveRide from "@/components/shared/NoActiveRide";
import NoRideHistory from "@/components/shared/NoRideHistory";

// React Query hooks
import { useDriverRides, useStartRide, useCompleteRide } from "@/lib/hooks";

export default function DriverRidesPage() {
  const [tab, setTab] = useState<"active" | "history">("active");

  // React Query hooks
  const { data: ridesData } = useDriverRides();
  const startRideMutation = useStartRide();
  const completeRideMutation = useCompleteRide();

  const rides = ridesData?.rides || [];

  // Derive active ride from React Query data (single source of truth)
  const activeRide = rides.find((r: any) =>
    ["accepted", "ongoing", "completion_requested"].includes(r.status)
  );

  const startRide = async () => {
    if (!activeRide) return;

    try {
      await startRideMutation.mutateAsync(activeRide._id);
      toast.success("Ride started");
    } catch (error: any) {
      toast.error(error.message || "Failed to start ride");
    }
  };

  const completeRide = async () => {
    if (!activeRide) return;

    try {
      await completeRideMutation.mutateAsync({
        rideId: activeRide._id,
        actualDistance: 5,
        actualDuration: 15,
      });
      toast.success("Ride completed");
    } catch (error: any) {
      toast.error(error.message || "Failed to complete ride");
    }
  };

  const historyRides = rides.filter((r: any) =>
    ["completed", "cancelled"].includes(r.status)
  );

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-rider-bg via-white to-gray-50">
      <div className="bg-gradient-to-r from-rider-primary to-rider-dark p-6 text-white">
        <h1 className="text-2xl font-bold font-jakarta">My Rides</h1>
        <p className="text-blue-100 text-sm mt-1">
          Manage your current and past rides
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-rider-primary data-[state=active]:text-white"
            >
              Active Ride
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-rider-primary data-[state=active]:text-white"
            >
              Ride History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            {!activeRide ? (
              <NoActiveRide />
            ) : (
              <Card>
                <CardContent className="p-4">
                  {/* Status */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      className={`${
                        STATUS_CONFIG[activeRide.status as RideStatus].color
                      } text-white`}
                    >
                      {STATUS_CONFIG[activeRide.status as RideStatus].label}
                    </Badge>
                    <p className="text-sm text-gray-500">
                      ID: #{activeRide?._id?.slice(0, 6) ?? "—"}
                    </p>
                  </div>

                  {/* Student Info */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-student-primary text-white">
                        {activeRide.student?.fullName?.charAt(0) ?? "S"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-semibold">
                        {activeRide.student?.fullName ?? "Student"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activeRide.student?.phoneNo ?? "Phone unavailable"}
                      </p>
                    </div>

                    {activeRide.student?.phoneNo && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-rider-primary text-rider-primary"
                        asChild
                      >
                        <a
                          href={`tel:${activeRide.student.phoneNo}`}
                          aria-label={`Call ${activeRide.student.fullName}`}
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Route Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-student-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-student-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Pickup Location
                        </p>
                        <p className="font-medium">
                          {activeRide.pickupLocation.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
                        <Navigation className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Destination
                        </p>
                        <p className="font-medium">
                          {activeRide.dropoffLocation.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {activeRide.status === "accepted" && (
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
                      onClick={startRide}
                      disabled={startRideMutation.isPending}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Ride
                    </Button>
                  )}

                  {activeRide.status === "ongoing" && (
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
                      onClick={completeRide}
                      disabled={completeRideMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Ride
                    </Button>
                  )}

                  {activeRide.status === "completion_requested" && (
                    <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-lg text-center animate-pulse">
                      <p className="font-semibold text-amber-700 mb-1">
                        Waiting for Confirmation
                      </p>
                      <p className="text-sm text-amber-600">
                        The student needs to confirm ride completion.
                      </p>
                      <div className="flex justify-center mt-2">
                        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  )}

                  {/* Fare */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600">Estimated Fare</p>
                      <p className="text-lg font-bold text-rider-primary">
                        ₦{activeRide.fare?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            {historyRides.length === 0 ? (
              <NoRideHistory />
            ) : (
              <div className="space-y-4">
                {historyRides.map((ride: any) => (
                  <Card key={ride._id}>
                    <CardContent>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <p className="font-medium text-sm">
                              {ride.pickupLocation.address}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <p className="font-medium text-sm">
                              {ride.dropoffLocation.address}
                            </p>
                          </div>
                        </div>

                        <Badge
                          className={`${
                            STATUS_CONFIG[ride.status as RideStatus]?.color ??
                            "bg-gray-500"
                          } text-white`}
                        >
                          {STATUS_CONFIG[ride.status as RideStatus]?.label ??
                            ride.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(ride.createdAt).toLocaleDateString()}
                          </div>

                          {ride.student?.fullName && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {ride.student.fullName}
                            </div>
                          )}
                        </div>

                        <p className="font-bold text-green-600">
                          ₦{ride.fare?.toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
