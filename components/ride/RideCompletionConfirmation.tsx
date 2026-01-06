/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  Navigation,
  Car,
  Loader2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { rideApi } from "@/lib/api";
import { toast } from "sonner";

interface PendingRide {
  id: string;
  pickupLocation: { address: string };
  dropoffLocation: { address: string };
  fare: number;
  paymentMethod: "Cash" | "Wallet";
  driver?: {
    id: string;
    fullName: string;
    phoneNo: string;
    vehicleInfo?: {
      make?: string;
      model?: string;
      color?: string;
      plateNumber?: string;
    };
  };
  completionRequestedAt: string;
}

interface RideCompletionConfirmationProps {
  onConfirmed?: () => void;
  onDisputed?: () => void;
}

export function RideCompletionConfirmation({
  onConfirmed,
  onDisputed,
}: RideCompletionConfirmationProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const queryClient = useQueryClient();

  // Check for pending confirmation ride
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["pending-confirmation"],
    queryFn: async () => {
      const response = await rideApi.getPendingConfirmation();
      return response as {
        success: boolean;
        hasPending: boolean;
        ride: PendingRide | null;
      };
    },
    refetchInterval: 10000, // Check every 10 seconds
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });

  const confirmMutation = useMutation({
    mutationFn: async () => {
      if (!data?.ride?.id) throw new Error("No ride to confirm");
      return rideApi.confirmCompletion(data.ride.id, { action: "confirm" });
    },
    onSuccess: () => {
      toast.success("Ride confirmed successfully!");
      queryClient.invalidateQueries({ queryKey: ["pending-confirmation"] });
      queryClient.invalidateQueries({ queryKey: ["student-rides"] });
      refetch();
      onConfirmed?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to confirm ride");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (!data?.ride?.id) throw new Error("No ride to dispute");
      return rideApi.confirmCompletion(data.ride.id, {
        action: "reject",
        reason: rejectReason,
      });
    },
    onSuccess: () => {
      toast.info("Ride disputed. Our support team will review this.");
      queryClient.invalidateQueries({ queryKey: ["pending-confirmation"] });
      queryClient.invalidateQueries({ queryKey: ["student-rides"] });
      refetch();
      setShowRejectForm(false);
      setRejectReason("");
      onDisputed?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to dispute ride");
    },
  });

  // Don't render if no pending confirmation
  if (isLoading || !data?.hasPending || !data?.ride) {
    return null;
  }

  const ride = data.ride;
  const isPending = confirmMutation.isPending || rejectMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-lg">Confirm Ride Completion</CardTitle>
              <p className="text-sm text-white/80">
                Your driver has marked this ride as completed
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Ride Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="text-sm font-medium">
                  {ride.pickupLocation.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="text-sm font-medium">
                  {ride.dropoffLocation.address}
                </p>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          {ride.driver && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-rider-primary text-white">
                  {ride.driver.fullName?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{ride.driver.fullName}</p>
                {ride.driver.vehicleInfo && (
                  <p className="text-xs text-gray-500">
                    {ride.driver.vehicleInfo.color}{" "}
                    {ride.driver.vehicleInfo.make} •{" "}
                    {ride.driver.vehicleInfo.plateNumber}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Fare */}
          <div className="flex items-center justify-between py-3 border-t border-b">
            <span className="text-gray-600">Total Fare</span>
            <span className="text-xl font-bold text-student-primary">
              ₦{ride.fare.toLocaleString()}
            </span>
          </div>

          {/* Time Since Request */}
          {ride.completionRequestedAt && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Requested {formatTimeAgo(ride.completionRequestedAt)}</span>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Please provide a reason for disputing this ride:
              </p>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Ride was not completed, wrong destination..."
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRejectForm(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => rejectMutation.mutate()}
                  disabled={isPending || !rejectReason.trim()}
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Submit Dispute
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">
                Did you complete this ride successfully?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => setShowRejectForm(true)}
                  disabled={isPending}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Dispute
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => confirmMutation.mutate()}
                  disabled={isPending}
                >
                  {confirmMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Confirm
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center">
            {ride.paymentMethod === "Wallet"
              ? "Your wallet will be charged upon confirmation."
              : "Please ensure you have paid the driver in cash."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

// Hook to check for pending confirmation
export function usePendingConfirmation() {
  return useQuery({
    queryKey: ["pending-confirmation"],
    queryFn: async () => {
      const response = await rideApi.getPendingConfirmation();
      return response as {
        success: boolean;
        hasPending: boolean;
        ride: PendingRide | null;
      };
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}
