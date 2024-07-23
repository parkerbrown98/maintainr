import { OdometerCard } from "@/components/odometer-card";
import { ServiceCard } from "@/components/service-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { odometerReadings, vehicles } from "@/drizzle/schema";
import { coalesce, db } from "@/lib/db";
import { eq, sql, sum } from "drizzle-orm";
import { PlusCircle } from "lucide-react";
import { notFound } from "next/navigation";

interface VehicleDetailProps {
  params: {
    id: string;
  };
}

export default async function VehicleDetail({ params }: VehicleDetailProps) {
  const { id } = params;
  const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);

  if (!vehicle) {
    return notFound();
  }

  const [distanceResult] = await db
    .select({ distance: coalesce(sum(odometerReadings.reading), sql`0`) })
    .from(odometerReadings)
    .where(eq(odometerReadings.vehicleId, id));
  
  return (
    <div className="grid md:grid-cols-4 xl:grid-cols-6 xl:grid-rows-5 gap-4">
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardDescription>Next service due in</CardDescription>
          <CardTitle className="text-3xl lg:text-4xl">4,569 mi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            <p>Next service due:</p>
            <p>161,233 miles</p>
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={25} aria-label="Miles until next service" />
        </CardFooter>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardDescription>Next service due in</CardDescription>
          <CardTitle className="text-3xl lg:text-4xl">4,569 mi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            <p>Next service due:</p>
            <p>161,233 miles</p>
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={25} aria-label="Miles until next service" />
        </CardFooter>
      </Card>
      <OdometerCard vehicleId={id} />
      <ServiceCard vehicleId={id} />
    </div>
  );
}
