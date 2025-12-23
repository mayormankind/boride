import { Calendar } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function NoRideHistory() {
    return (  
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Ride History
          </h3>
          <p className="text-gray-500 text-sm">
            Your completed and cancelled rides will appear here</p>
        </CardContent>
      </Card>
    );
  }
  