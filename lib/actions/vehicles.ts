"use server";

import {
  odometerReadings,
  users,
  VehicleInsert,
  vehicles,
} from "@/drizzle/schema";
import { db } from "../db";
import { validateUser } from "../auth";
import { and, eq } from "drizzle-orm";
import convert from "convert";

export async function createVehicle(
  vehicle: VehicleInsert & { odometer: number }
) {
  const user = await validateUser();
  if (!user || !user.user) return { error: "User not found" };

  if (vehicle.odometer < 0)
    return { error: "Odometer reading cannot be negative" };

  if (vehicle.year < 1900 || vehicle.year > new Date().getFullYear())
    return { error: "Invalid year" };

  if (vehicle.userId !== user.user.id) return { error: "Invalid user ID" };

  const [createdVehicle] = await db
    .insert(vehicles)
    .values(vehicle)
    .returning();

  if (!createdVehicle) return { error: "Failed to create new vehicle" };

  await db.insert(odometerReadings).values({
    vehicleId: createdVehicle.id,
    reading: Math.round(
      convert(
        vehicle.odometer,
        user.preferences.lengthUnits === "metric" ? "km" : "mi"
      ).to("mi")
    ),
    recordedAt: new Date(),
  });

  return null;
}

export async function editVehicle(
  vehicleId: string,
  vehicle: Omit<VehicleInsert, "userId">
) {
  const user = await validateUser();
  if (!user || !user.user) return { error: "User not found" };

  if (vehicle.year < 1900 || vehicle.year > new Date().getFullYear())
    return { error: "Invalid year" };

  await db
    .update(vehicles)
    .set(vehicle)
    .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.user.id)));

  return null;
}

export async function setActiveVehicle(vehicleId: string) {
  const user = await validateUser();
  if (!user || !user.user) return { error: "User not found" };

  await db
    .update(users)
    .set({ selectedVehicleId: vehicleId })
    .where(eq(users.id, user.user.id));

  return null;
}
