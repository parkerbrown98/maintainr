"use server";

import {
  odometerReadings,
  users,
  VehicleInsert,
  vehicles,
} from "@/drizzle/schema";
import { db } from "../db";
import { validateUser } from "../auth";
import { eq } from "drizzle-orm";

export async function createVehicle(
  vehicle: VehicleInsert & { odometer: number }
) {
  const [createdVehicle] = await db
    .insert(vehicles)
    .values(vehicle)
    .returning();

  if (!createdVehicle) return { error: "Failed to create new vehicle" };

  await db.insert(odometerReadings).values({
    vehicleId: createdVehicle.id,
    reading: vehicle.odometer,
    recordedAt: new Date(),
  });

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
