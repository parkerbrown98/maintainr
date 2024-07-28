import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { VehicleActions } from "@/components/vehicle-actions";
import VehicleCard from "@/components/vehicle-card";
import { vehicles } from "@/drizzle/schema";
import { validateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function Vehicles() {
  const session = await validateUser();
  if (!session) {
    return notFound();
  }

  const ourVehicles = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.userId, session!.user!.id));

  return (
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
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Vehicles
        </h1>
        <VehicleActions />
      </div>
      {ourVehicles.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-4">
          {ourVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
      {ourVehicles.length === 0 && (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no vehicles
            </h3>
            <p className="text-sm text-muted-foreground">
              Add a vehicle to track maintenance and other important information
            </p>
            <VehicleActions />
          </div>
        </div>
      )}
    </div>
  );
}
