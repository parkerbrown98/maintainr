import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UnitFormat } from "@/components/unit-format";
import { VehicleDetailActions } from "@/components/vehicle-detail-actions";
import { VehicleTabs } from "@/components/vehicle-tabs";
import { odometerReadings, vehicles } from "@/drizzle/schema";
import { VehicleProvider } from "@/lib/context/vehicle";
import { coalesce, db } from "@/lib/db";
import { eq, max, sql } from "drizzle-orm";
import { Check, GalleryVertical, Gauge, Pencil } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
  children: React.ReactNode;
}

export default async function VehiclesLayout({ params, children }: Props) {
  const { id: vehicleId } = params;
  if (!vehicleId) {
    return notFound();
  }

  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, vehicleId))
    .limit(1);

  if (!vehicle) {
    return notFound();
  }

  const [distanceResult] = await db
    .select({ distance: coalesce(max(odometerReadings.reading), sql`0`) })
    .from(odometerReadings)
    .where(eq(odometerReadings.vehicleId, vehicleId));

  return (
    <VehicleProvider vehicle={vehicle}>
      <div className="flex flex-col h-full gap-4 lg:gap-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/vehicles">Vehicles</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/vehicles/${vehicleId}`}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <div className="flex items-center gap-x-4">
              {vehicle.vin && (
                <p className="text-sm text-muted-foreground">{vehicle.vin}</p>
              )}
              <p className="flex items-center gap-x-1.5 text-sm text-muted-foreground">
                <Gauge className="h-4 w-4" />
                <UnitFormat value={distanceResult?.distance ?? 0} unit="length" />
              </p>
              {vehicle.licensePlate && (
                <p className="flex items-center gap-x-1.5 text-sm text-muted-foreground">
                  <GalleryVertical className="h-4 w-4" />
                  {vehicle.licensePlate?.toLocaleString() ?? "N/A"}
                </p>
              )}
            </div>
          </div>
          <VehicleDetailActions vehicleId={vehicleId} />
        </div>
        <VehicleTabs id={vehicle.id} />
        {children}
      </div>
    </VehicleProvider>
  );
}
