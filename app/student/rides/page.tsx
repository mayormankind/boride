/* eslint-disable @typescript-eslint/no-explicit-any */
//app/student/rides
"use client";

import { useState } from "react";
import { MapPin, Navigation, Phone, Car, Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { STATUS_CONFIG, RideStatus } from "@/lib/helpers";

import { RateRideModal } from "@/components/shared/RateRideModal";
import { toast } from "sonner";
import Link from "next/link";
import NoActiveRide from "@/components/shared/NoActiveRide";
import NoRideHistory from "@/components/shared/NoRideHistory";

// React Query hooks
import { useStudentRides, useRateRide } from "@/lib/hooks";

export default function StudentRidesPage() {
  const [tab, setTab] = useState<"active" | "history">("active");
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<any>(null);

  // React Query hooks
  const { data: ridesData } = useStudentRides();
  const rateRideMutation = useRateRide();

  const rides = ridesData?.rides || [];

  // Derive active ride from React Query data (single source of truth)
  const activeRide = rides.find((r: any) =>
    ["pending", "accepted", "ongoing"].includes(r.status)
  );

  const handleRateSubmit = async (rating: number, review?: string) => {
    if (!selectedRide) return;

    try {
      await rateRideMutation.mutateAsync({
        rideId: selectedRide._id,
        rating,
        review,
      });
      toast.success("Rating submitted");
      setRateModalOpen(false);
    } catch {
      toast.error("Failed to submit rating");
    }
  };

  const historyRides = rides.filter((r: any) =>
    ["completed", "cancelled"].includes(r.status)
  );

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-student-bg via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-student-primary to-student-dark p-6 text-white">
        <h1 className="text-2xl font-bold font-jakarta">My Rides</h1>
        <p className="text-emerald-100 text-sm">Track your rides</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid grid-cols-2 mb-6 w-full">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-student-primary data-[state=active]:text-white"
            >
              Active Ride
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-student-primary data-[state=active]:text-white"
            >
              Ride History
            </TabsTrigger>
          </TabsList>

          {/* ACTIVE */}
          <TabsContent value="active">
            {activeRide ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <Badge
                      className={`${
                        STATUS_CONFIG[activeRide.status as RideStatus].color
                      } text-white`}
                    >
                      {STATUS_CONFIG[activeRide.status as RideStatus].label}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      #{activeRide?._id?.slice(0, 8) ?? "—"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3 items-center">
                      <MapPin className="w-4 h-4 text-student-primary" />
                      <p>{activeRide.pickupLocation.address}</p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Navigation className="w-4 h-4 text-emerald-600" />
                      <p>{activeRide.dropoffLocation.address}</p>
                    </div>
                  </div>

                  {activeRide.driver && (
                    <div className="border-t mt-6 pt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback>
                            {activeRide.driver.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {activeRide.driver.fullName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activeRide.driver.phoneNo}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1">
                          <Link
                            href={`tel:${activeRide.driver.phoneNo}`}
                            className="flex items-center"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="border-t mt-4 pt-4 flex justify-between">
                    <span>Fare</span>
                    <span className="font-bold text-student-primary">
                      ₦{activeRide.fare.toLocaleString()}
                    </span>
                  </div>

                  {/* View Timeline Link */}
                  <Link href={`/student/rides/${activeRide._id}`}>
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-student-primary text-student-primary hover:bg-student-primary hover:text-white"
                    >
                      View Ride Timeline
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <NoActiveRide />
            )}
          </TabsContent>

          {/* HISTORY */}
          <TabsContent value="history">
            {historyRides.length === 0 ? (
              <NoRideHistory />
            ) : (
              <div className="space-y-4">
                {historyRides.map((ride: any) => (
                  <Card key={ride._id}>
                    <CardContent>
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="text-sm">
                            {ride.pickupLocation.address}
                          </p>
                          <p className="text-sm">
                            {ride.dropoffLocation.address}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            STATUS_CONFIG[ride.status as RideStatus].color
                          } text-white`}
                        >
                          {STATUS_CONFIG[ride.status as RideStatus].label}
                        </Badge>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          <Calendar className="inline w-3 h-3 mr-1" />
                          {new Date(ride.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-bold">
                          ₦{ride.fare.toLocaleString()}
                        </span>
                      </div>

                      {ride.status === "completed" && !ride.rating && (
                        <Button
                          variant="ghost"
                          className="mt-3 w-full bg-student-primary text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedRide(ride);
                            setRateModalOpen(true);
                          }}
                        >
                          Rate Driver
                        </Button>
                      )}

                      {/* View Timeline Link */}
                      <Link href={`/student/rides/${ride._id}`}>
                        <Button
                          variant="ghost"
                          className="mt-2 w-full text-student-primary hover:bg-student-primary/10"
                        >
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <RateRideModal
        isOpen={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        onSubmit={handleRateSubmit}
        driverName={selectedRide?.driver?.fullName ?? "Driver"}
      />
    </div>
  );
}
