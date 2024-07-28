"use server";

import { odometerReadings, vehicles } from "@/drizzle/schema";
import { db } from "../db";
import { and, eq } from "drizzle-orm";
import { validateUser } from "../auth";
import convert from "convert";

interface CreateOdometerReading {
  vehicleId: string;
  date: Date;
  odometer: number;
}

export async function createOdometerReading({
  vehicleId,
  date,
  odometer,
}: CreateOdometerReading) {
  const user = await validateUser();
  if (!user) {
    return { error: "User not found" };
  }

  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.user.id)))
    .limit(1);

  if (!vehicle) {
    return { error: "Vehicle not found" };
  }

  await db.insert(odometerReadings).values({
    vehicleId,
    recordedAt: date,
    reading: Math.round(
      convert(
        odometer,
        user.preferences.lengthUnits === "metric" ? "km" : "mi"
      ).to("mi")
    ),
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
    .where(eq(odometerReadings.id, id))
    .limit(1);

  if (!reading) {
    return { error: "Reading not found" };
  }

  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(
      and(eq(vehicles.userId, user.user.id), eq(vehicles.id, reading.vehicleId))
    )
    .limit(1);

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

export async function editOdometerReading({
  id,
  date,
  odometer,
}: EditOdometerReading) {
  const user = await validateUser();
  if (!user) {
    return { error: "User not found" };
  }

  // Ensure the user owns the vehicle
  const [reading] = await db
    .select()
    .from(odometerReadings)
    .where(eq(odometerReadings.id, id))
    .limit(1);

  if (!reading) {
    return { error: "Reading not found" };
  }

  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(
      and(eq(vehicles.userId, user.user.id), eq(vehicles.id, reading.vehicleId))
    )
    .limit(1);

  if (!vehicle) {
    return { error: "Vehicle not found" };
  }

  await db
    .update(odometerReadings)
    .set({
      recordedAt: date,
      reading: Math.round(
        convert(
          odometer,
          user.preferences.lengthUnits === "metric" ? "km" : "mi"
        ).to("mi")
      ),
    })
    .where(eq(odometerReadings.id, id));

  return null;
}
