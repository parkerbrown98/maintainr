"use server";

import { odometerReadings, vehicles } from "@/drizzle/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { validateUser } from "../auth";

interface CreateOdometerReading {
  vehicleId: string;
  date: Date;
  odometer: number;
}

// TODO: Check ownership of vehicle
export async function createOdometerReading({
  vehicleId,
  date,
  odometer,
}: CreateOdometerReading) {
  await db.insert(odometerReadings).values({
    vehicleId,
    recordedAt: date,
    reading: odometer,
  });

  return null;
}

interface DeleteOdometerReading {
  id: string;
}

export async function deleteOdometerReading({ id }: DeleteOdometerReading) {
  const user = await validateUser();
  if (!user) {
    return { error: "User not found" };
  }

  // Ensure the user owns the vehicle
  const [reading] = await db
    .select()
    .from(odometerReadings)
    .where(eq(odometerReadings.id, id));

  if (!reading) {
    return { error: "Reading not found" };
  }

  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.userId, user.user.id));

  if (!vehicle || vehicle.id !== reading.vehicleId) {
    return { error: "Vehicle not found" };
  }

  await db.delete(odometerReadings).where(eq(odometerReadings.id, id));

  return null;
}

interface EditOdometerReading {
  id: string;
  date: Date;
  odometer: number;
}

// TODO: Check ownership of vehicle
export async function editOdometerReading({
  id,
  date,
  odometer,
}: EditOdometerReading) {
  await db
    .update(odometerReadings)
    .set({
      recordedAt: date,
      reading: odometer,
    })
    .where(eq(odometerReadings.id, id));

  return null;
}
