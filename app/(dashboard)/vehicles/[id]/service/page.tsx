import { ViewServiceSheet } from "@/components/sheets/view-service";
import { columns } from "@/components/tables/service/columns";
import { ServiceDataTable } from "@/components/tables/service/table";
import { serviceRecords, uploads, vehicles } from "@/drizzle/schema";
import { validateUser } from "@/lib/auth";
import { SheetProvider } from "@/lib/context/sheet";
import { ServiceProvider } from "@/lib/context/service";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface VehicleMaintenanceProps {
  params: {
    id: string;
  };
  searchParams: {
    show?: string;
  };
}

export default async function VehicleMaintenance({
  params,
  searchParams,
}: VehicleMaintenanceProps) {
  const { id } = params;
  const { show } = searchParams;

  if (!id) {
    return notFound();
  }

  const user = await validateUser();
  if (!user || !user.user) {
    return notFound();
  }

  const service = show
    ? await db
        .select()
        .from(serviceRecords)
        .leftJoin(vehicles, eq(vehicles.id, serviceRecords.vehicleId))
        .where(
          and(eq(serviceRecords.id, show), eq(vehicles.userId, user.user.id))
        )
        .limit(1)
    : null;

  const serviceUploads = show
    ? await db.select().from(uploads).where(eq(uploads.serviceRecordId, show))
    : null;

  const allServicesWithVehicle = await db
    .select()
    .from(serviceRecords)
    .leftJoin(vehicles, eq(vehicles.id, serviceRecords.vehicleId))
    .where(and(eq(vehicles.id, id), eq(vehicles.userId, user.user.id)));

  const allServices = allServicesWithVehicle.map(
    (service) => service.service_records
  );

  return (
    <ServiceProvider
      service={
        service && service.length > 0 ? service[0].service_records : null
      }
      uploads={serviceUploads}
    >
      <SheetProvider open={service !== null && service.length > 0}>
        <ViewServiceSheet />
        <div className="flex flex-col gap-4 lg:gap-6">
          <ServiceDataTable columns={columns} data={allServices} />
        </div>
      </SheetProvider>
    </ServiceProvider>
  );
}
