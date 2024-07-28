import { odometerReadings, Vehicle } from "@/drizzle/schema";
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
import { coalesce, db } from "@/lib/db";
import { eq, max, sql } from "drizzle-orm";
import { UnitFormat } from "./unit-format";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default async function VehicleCard({ vehicle }: VehicleCardProps) {
  const [odometerReading] = await db
    .select({ reading: coalesce(max(odometerReadings.reading), sql`0`) })
    .from(odometerReadings)
    .where(eq(odometerReadings.vehicleId, vehicle.id));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-x-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback>
            {vehicle.make.charAt(0).toUpperCase()}
            {vehicle.model.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </CardTitle>
          <CardDescription>bing bong</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Odometer</p>
            <p className="text-lg font-semibold">
              <UnitFormat value={odometerReading.reading ?? 0} unit="length" />
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Service</p>
            <p className="text-lg font-semibold">100,000</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Service</p>
            <p className="text-lg font-semibold">100,000</p>
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
