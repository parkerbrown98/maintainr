import { Vehicle } from "@/drizzle/schema";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </CardTitle>
        <CardDescription>{vehicle.vin ?? "No VIN provided"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Odometer</p>
            <p className="text-lg font-bold">
              96,360 mi
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Service</p>
            <p className="text-lg font-bold">100,000</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Service</p>
            <p className="text-lg font-bold">100,000</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button size="sm" asChild>
          <Link href={`/vehicles/${vehicle.id}`}>View</Link>
        </Button>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
