import { CarIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function NoActiveRide() {
    return (  
      <Card>
        <CardContent className="p-12 text-center">
          <CarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Active Ride
          </h3>
          <p className="text-gray-500 text-sm">
            You don’t have any ongoing ride.
            <br />
            Go online to start accepting ride requests!
          </p>
        </CardContent>
      </Card>
    );
  }
  