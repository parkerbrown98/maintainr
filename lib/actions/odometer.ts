"use server";

import { odometerReadings } from "@/drizzle/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

// TODO: Check ownership of vehicle

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
  await db
    .update(odometerReadings)
    .set({
      recordedAt: date,
      reading: odometer,
    })
    .where(eq(odometerReadings.id, id));

  return null;
}
