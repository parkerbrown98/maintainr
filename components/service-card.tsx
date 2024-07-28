import { serviceRecords } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { ServiceCardActions } from "./service-card-actions";
import { SERVICE_TYPES } from "@/lib/constants";
import moment from "moment";
import { ServiceRowActions } from "./service-row-actions";
import Link from "next/link";
import { UnitFormat } from "./unit-format";

interface ServiceCardProps extends React.HTMLProps<HTMLDivElement> {
  vehicleId: string;
}

export async function ServiceCard({ vehicleId, ...props }: ServiceCardProps) {
  const serviceResults = await db
    .select()
    .from(serviceRecords)
    .where(eq(serviceRecords.vehicleId, vehicleId))
    .orderBy(desc(serviceRecords.serviceDate))
    .limit(10);

  if (!serviceResults) {
    return null;
  }

  return (
    <Card className="flex flex-col md:col-span-4 md:row-span-3" {...props}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Service Log</CardTitle>
          <CardDescription>
            Past and upcoming services on this vehicle
          </CardDescription>
        </div>
        <ServiceCardActions />
      </CardHeader>
      <CardContent className="flex flex-col flex-1 min-h-48">
        {serviceResults.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="hidden md:table-cell">Cost</TableHead>
                <TableHead className="hidden sm:table-cell">Odometer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden md:table-cell"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceResults.map((service) => {
                const serviceType =
                  service.serviceType as keyof typeof SERVICE_TYPES;
                const formattedDate = moment(service.serviceDate).format(
                  "MMM D, YYYY"
                );
                const fromNow = moment(service.serviceDate).fromNow();
                const serviceUrl = `/vehicles/${vehicleId}/service/?show=${service.id}`;

                return (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Link
                        href={serviceUrl}
                        className="block font-medium hover:underline"
                      >
                        {SERVICE_TYPES[serviceType]}
                      </Link>
                      <div className="hidden text-sm text-muted-foreground md:inline truncate">
                        {service.description}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {service.cost ? `$${service.cost}` : "N/A"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {service.odometer ? (
                        <UnitFormat value={service.odometer} unit="length" />
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <div>{formattedDate}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {fromNow}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <ServiceRowActions service={service} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex-1 grid place-content-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-xl font-bold tracking-tight">
                No records found
              </h3>
              <p className="text-sm text-muted-foreground">
                Keep track of maintenance and repairs for your vehicle
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
