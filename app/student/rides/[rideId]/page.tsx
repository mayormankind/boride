"use client";

import { useParams } from "next/navigation";
import { use } from "react";
import {
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  Car,
  User,
  Star,
  Loader2,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RideTimeline } from "@/components/ride/RideTimeline";
import { useRideDetails } from "@/lib/hooks/useRideDetails";
import StudentBottomNav from "@/components/shared/StudentBottomNav";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Searching for Driver", color: "bg-yellow-500" },
  accepted: { label: "Driver Assigned", color: "bg-blue-500" },
  ongoing: { label: "In Progress", color: "bg-green-500" },
  completed: { label: "Completed", color: "bg-gray-500" },
  cancelled: { label: "Cancelled", color: "bg-red-500" },
};

interface PageProps {
  params: Promise<{ rideId: string }>;
}

export default function StudentRideDetailsPage({ params }: PageProps) {
  const { rideId } = use(params);

  const {
    data: ride,
    isLoading,
    isError,
    error,
    refetch,
  } = useRideDetails({
    rideId,
    userType: "student",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-student-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (isError || !ride) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-gradient-to-r from-student-primary to-student-dark p-6 text-white">
          <Link
            href="/student/rides"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Rides
          </Link>
          <h1 className="text-2xl font-bold font-jakarta">Ride Details</h1>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Unable to load ride
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {(error as Error)?.message || "Something went wrong"}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
        <StudentBottomNav />
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[ride.status] || STATUS_CONFIG.pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-student-bg via-white to-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-student-primary to-student-dark p-6 text-white">
        <Link
          href="/student/rides"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Rides
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-jakarta">Ride Details</h1>
            <p className="text-emerald-100 text-sm mt-1">
              Ride #{ride.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <Badge className={`${statusConfig.color} text-white px-3 py-1`}>
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Route Summary */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-student-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-student-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                  <p className="font-medium">{ride.pickupLocation.address}</p>
                </div>
              </div>

              <div className="border-l-2 border-dashed border-gray-200 ml-5 h-4" />

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Destination</p>
                  <p className="font-medium">{ride.dropoffLocation.address}</p>
                </div>
              </div>
            </div>

            {/* Fare Info */}
            <div className="border-t mt-4 pt-4 flex items-center justify-between">
              <div className="text-gray-600">
                <p className="text-sm">Total Fare</p>
                <p className="text-xs text-gray-400">
                  {ride.paymentMethod} Payment
                </p>
              </div>
              <p className="text-2xl font-bold text-student-primary">
                ₦{ride.fare.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Driver Info (if assigned) */}
        {ride.driver && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-student-primary" />
                Driver Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-rider-primary text-white text-xl">
                    {ride.driver.fullName?.charAt(0) || "D"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">
                    {ride.driver.fullName}
                  </p>
                  <p className="text-sm text-gray-500">{ride.driver.phoneNo}</p>
                </div>
              </div>

              {/* Vehicle Info */}
              {ride.driver.vehicleInfo && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-4 h-4 text-gray-600" />
                    <p className="font-medium text-sm">
                      {ride.driver.vehicleInfo.make}{" "}
                      {ride.driver.vehicleInfo.model}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {ride.driver.vehicleInfo.color} •{" "}
                    {ride.driver.vehicleInfo.plateNumber}
                  </p>
                </div>
              )}

              {/* Contact Buttons - only for active rides */}
              {["accepted", "ongoing"].includes(ride.status) && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-student-primary text-student-primary hover:bg-student-primary hover:text-white"
                    asChild
                  >
                    <a href={`tel:${ride.driver.phoneNo}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-student-primary text-student-primary hover:bg-student-primary hover:text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Ride Timeline */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-student-primary" />
              Ride Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RideTimeline timeline={ride.timeline} />
          </CardContent>
        </Card>

        {/* Rating Section - only for completed rides without rating */}
        {ride.status === "completed" && (
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              {ride.rating ? (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Your Rating</p>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= ride.rating!
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {ride.review && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      "{ride.review}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">How was your ride?</p>
                  <Link href={`/student/rides`}>
                    <Button className="bg-student-primary hover:bg-student-dark">
                      Rate Your Trip
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <StudentBottomNav />
    </div>
  );
}
