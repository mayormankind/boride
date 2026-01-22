"use client";

import { useState } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  ChevronRight,
  Car,
  Loader2Icon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/lib/stores/authStore";
import { toast } from "sonner";
import { PaymentMethodModal } from "@/components/shared/PaymentMethodModal";

// React Query hooks
import { useWalletBalance, useStudentRides, useBookRide } from "@/lib/hooks";
import Link from "next/link";

const SAVED_LOCATIONS = [
  { id: "1", name: "Hostel", address: "Student Hostel Block A" },
  { id: "2", name: "Library", address: "Main Campus Library" },
  { id: "3", name: "Cafeteria", address: "Central Cafeteria" },
  { id: "4", name: "Sports Complex", address: "Campus Sports Arena" },
];

const ESTIMATED_FARE = 200;

export default function StudentDashboard() {
  const user = useAuthStore((state) => state.user);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // React Query hooks
  const { data: walletBalance = 0, isLoading: isLoadingBalance } =
    useWalletBalance("student");
  const { data: ridesData, isLoading: isFetchingRides } = useStudentRides();
  const bookRideMutation = useBookRide();

  const rides = ridesData?.rides?.slice(0, 3) || [];

  // Step 1: Fetch wallet balance and open payment modal
  const handleRequestRide = async () => {
    if (!pickup || !destination) return;

    if (isLoadingBalance) {
      toast.error("Loading wallet balance...");
      return;
    }

    setShowPaymentModal(true);
  };

  // Step 2: Confirm and book ride
  const handleConfirmPayment = async (method: "Cash" | "Wallet") => {
    if (!pickup || !destination) return;

    try {
      const payload = {
        pickupLocation: {
          address: pickup,
          coordinates: { latitude: 0, longitude: 0 },
        },
        dropoffLocation: {
          address: destination,
          coordinates: { latitude: 0, longitude: 0 },
        },
        fare: ESTIMATED_FARE,
        paymentMethod: method,
        estimatedDistance: 2.5,
        estimatedDuration: 15,
      };

      await bookRideMutation.mutateAsync(payload);
      toast.success("Ride requested successfully!");
      setPickup("");
      setDestination("");
      setShowPaymentModal(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-student-bg via-white to-gray-50 pb-20">
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handleConfirmPayment}
        fare={ESTIMATED_FARE}
        walletBalance={walletBalance}
      />

      {/* Header */}
      <div className="bg-linear-to-r from-student-primary to-student-dark p-6 text-white rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold font-jakarta">
              Hello, {user?.fullName?.split(" ")[0] || "Student"}! 👋
            </h1>
            <p className="text-emerald-100 text-sm mt-1">
              Where are you headed today?
            </p>
          </div>
          <Avatar className="w-14 h-14 border-2 border-white shadow-md">
            <AvatarImage src={user?.profileImage} alt={user?.fullName} />
            <AvatarFallback className="bg-white text-student-primary font-semibold text-lg">
              {user?.fullName?.charAt(0) || "S"}
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
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-student-primary" />
              <Input
                placeholder="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="pl-11 h-12 border-2 focus:border-student-primary"
              />
            </div>

            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
              <Input
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-11 h-12 border-2 focus:border-student-primary"
              />
            </div>

            <Button
              onClick={handleRequestRide}
              disabled={!pickup || !destination || bookRideMutation.isPending}
              className="w-full h-12 bg-linear-to-r from-student-primary to-student-dark hover:from-student-dark hover:to-student-hover text-white font-semibold text-base shadow-md disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300"
            >
              {bookRideMutation.isPending ? (
                <Loader2Icon className="animate-spin mr-2" />
              ) : null}
              {bookRideMutation.isPending ? "Requesting..." : "Request Ride"}
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
                className="shrink-0 w-44 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-student-primary"
                onClick={() => setPickup(location.address)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-student-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{location.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {location.address}
                      </p>
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

          {isFetchingRides ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : rides.length > 0 ? (
            <div className="space-y-3">
              {rides.map((ride: any) => (
                <Link href={`/student/rides/${ride._id}`} key={ride._id}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <p className="font-medium text-sm">
                              {ride.pickupLocation.address}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-emerald-600" />
                            <p className="font-medium text-sm">
                              {ride.dropoffLocation.address}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-2 items-center">
                            <p className="text-xs text-gray-500">
                              {new Date(ride.createdAt).toLocaleDateString()} •
                              ₦{ride.fare}
                            </p>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full ${
                                ride.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : ride.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {ride.status}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent rides</p>
                <p className="text-sm text-gray-400 mt-1">
                  Request your first ride to get started
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
