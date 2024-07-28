import { odometerReadings } from "@/drizzle/schema";
import { db, coalesce } from "@/lib/db";
import { sql, eq, desc, max } from "drizzle-orm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import moment from "moment";
import { OdometerCardActions } from "./odometer-card-actions";
import { OdometerRowActions } from "./odometer-row-actions";
import { UnitFormat } from "./unit-format";

interface OdometerCardProps {
  vehicleId: string;
}

export async function OdometerCard({ vehicleId }: OdometerCardProps) {
  const [distanceResult] = await db
    .select({ distance: coalesce(max(odometerReadings.reading), sql`0`) })
    .from(odometerReadings)
    .where(eq(odometerReadings.vehicleId, vehicleId));

  const readings = await db
    .select()
    .from(odometerReadings)
    .where(eq(odometerReadings.vehicleId, vehicleId))
    .orderBy(desc(odometerReadings.recordedAt))
    .limit(10);

  // Add delta to each reading using the previous reading
  const readingsWithDelta = readings.map((reading, index) => {
    const previousReading = readings[index + 1];
    if (!previousReading) {
      return { ...reading, delta: 0 };
    }

    return { ...reading, delta: reading.reading - previousReading.reading };
  });

  return (
    <Card className="md:col-span-4 xl:col-span-2 md:row-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Odometer</CardTitle>
          <CardDescription>
            <UnitFormat value={distanceResult.distance ?? 0} unit="length" />
          </CardDescription>
        </div>
        <OdometerCardActions />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Odometer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readingsWithDelta.map((reading) => (
              <TableRow key={reading.id}>
                <TableCell>
                  <div className="font-medium">
                    <UnitFormat value={reading.reading} unit="length" />
                  </div>
                  {reading.delta > 0 && (
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      +<UnitFormat value={reading.delta} unit="length" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>{moment(reading.recordedAt).format("MMMM D, YYYY")}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {moment(reading.recordedAt).fromNow()}
                  </div>
                </TableCell>
                <TableCell>
                  <OdometerRowActions reading={reading} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
