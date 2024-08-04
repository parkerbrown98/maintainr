import { TotalDistanceChart } from "@/components/charts/total-distance";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UnitFormat } from "@/components/unit-format";
import { odometerReadings, serviceRecords, vehicles } from "@/drizzle/schema";
import { validateUser } from "@/lib/auth";
import { coalesce, db } from "@/lib/db";
import {
  getDistanceDrivenPerMonth,
  getReadingsWithDelta,
} from "@/lib/queries/odometer";
import { count, eq, max, desc, sum, sql } from "drizzle-orm";
import { CarFront, DollarSign, Gauge, Ruler } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Home() {
  const thisYear = new Date().getFullYear();
  const user = await validateUser();

  if (!user || !user.user) {
    return notFound();
  }

  const distanceDrivenPerMonth = await getDistanceDrivenPerMonth(
    user.user.id,
    thisYear
  );

  const totalDistance = await db
    .select({ distance: max(odometerReadings.reading) })
    .from(odometerReadings)
    .leftJoin(vehicles, eq(odometerReadings.vehicleId, vehicles.id))
    .where(eq(vehicles.userId, user.user.id))
    .groupBy(odometerReadings.vehicleId);

  const [totalVehicles] = await db
    .select({ count: count(vehicles.id) })
    .from(vehicles)
    .where(eq(vehicles.userId, user.user.id));

  const totalDist = totalDistance.reduce(
    (acc, { distance }) => acc + (distance ?? 0),
    0
  );

  const recentReadings = await db
    .select()
    .from(odometerReadings)
    .leftJoin(vehicles, eq(odometerReadings.vehicleId, vehicles.id))
    .where(eq(vehicles.userId, user.user.id))
    .orderBy(desc(odometerReadings.recordedAt))
    .limit(10);

  let readingsWithDelta = await getReadingsWithDelta(user.user.id);

  const [moneySpent] = await db
    .select({ total: coalesce(sum(serviceRecords.cost), sql`0`) })
    .from(serviceRecords)
    .leftJoin(vehicles, eq(serviceRecords.vehicleId, vehicles.id))
    .where(eq(vehicles.userId, user.user.id));

  const parsedMoneySpent = moneySpent ? parseFloat(moneySpent.total ?? "0") : 0;

  return (
    <div className="flex flex-col h-full gap-4 lg:gap-6">
      <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
        Overview
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/vehicles">
          <Card>
            <CardHeader>
              <CardDescription className="flex items-center justify-between">
                Total vehicles
                <CarFront className="w-4 h-4" />
              </CardDescription>
              <CardTitle className="text-2xl lg:text-3xl">
                {totalVehicles.count}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center justify-between">
              Distance driven
              <Gauge className="w-4 h-4" />
            </CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">
              <UnitFormat value={totalDist} unit="length" />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center justify-between">
              Money spent
              <DollarSign className="w-4 h-4" />
            </CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">
              {parsedMoneySpent.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-dashed border-border"></Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 xl:grid-cols-8 items-start">
        <Card className="lg:col-span-2 xl:col-span-5">
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">
              Distance this year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TotalDistanceChart data={distanceDrivenPerMonth} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 xl:col-span-3">
          <CardHeader className="space-y-0.5">
            <CardTitle className="text-base lg:text-lg">
              Recent readings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {readingsWithDelta.map((reading) => (
              <Link
                key={reading.reading}
                href={`/vehicles/${reading.vehicle_id}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar>
                    <AvatarFallback>
                      {reading.make?.charAt(0)}
                      {reading.model?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {reading.year} {reading.make} {reading.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {moment(reading.recorded_at).format("MMM D, YYYY")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium flex-shrink-0">
                    {reading.delta > 0 ? "+" : ""}
                    <UnitFormat
                      value={
                        reading.delta > 0 ? reading.delta : reading.reading
                      }
                      unit="length"
                    />
                  </p>
                  {reading.delta <= 0 && (
                    <p className="text-sm text-muted-foreground text-right">
                      New entry
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
