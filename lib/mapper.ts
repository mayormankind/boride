import { Ride } from "./types";

export function mapBackendRideToStoreRide(r: any): Ride {
    return {
      id: r._id,
      studentId: r.student?._id ?? '',
      driverId: r.driver?._id,
      studentName: r.student?.fullName ?? '',
      studentPhone: r.student?.phoneNo ?? '',
      driverName: r.driver?.fullName,
      driverPhone: r.driver?.phoneNo,
      vehicleInfo: r.driver?.vehicleInfo,
      pickupLocation: r.pickupLocation.address ?? '',
      destination: r.dropoffLocation.address ?? '',
      status: r.status,
      estimatedFare: r.fare,
      requestedAt: new Date(r.createdAt),
      actualFare: r.actualFare,
    };
  }
  