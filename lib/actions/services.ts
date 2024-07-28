"use server";

import {
  ServiceRecord,
  ServiceRecordInsert,
  serviceRecords,
  vehicles,
} from "@/drizzle/schema";
import { db } from "../db";
import { and, eq } from "drizzle-orm";
import { validateUser } from "../auth";
import convert from "convert";

export async function createServiceRecord(record: ServiceRecordInsert) {
  const user = await validateUser();
  if (!user || !user.user || !user.preferences)
    return { error: "User not found" };

  if (record.odometer && record.odometer < 0)
    return { error: "Odometer reading cannot be negative" };

  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(
      and(eq(vehicles.id, record.vehicleId), eq(vehicles.userId, user.user.id))
    )
    .limit(1);

  if (!vehicle) return { error: "Vehicle not found" };

  await db.insert(serviceRecords).values({
    ...record,
    odometer: Math.round(
      convert(
        record.odometer as number,
        user.preferences.lengthUnits === "metric" ? "km" : "mi"
      ).to("mi")
    ),
  });
  return null;
}

export async function editServiceRecord(
  id: string,
  record: Partial<ServiceRecord>
) {
  const user = await validateUser();
  if (!user || !user.user || !user.preferences)
    return { error: "User not found" };

  if (record.odometer && record.odometer < 0)
    return { error: "Odometer reading cannot be negative" };

  const [serviceRecord] = await db
    .select()
    .from(serviceRecords)
    .leftJoin(vehicles, eq(serviceRecords.vehicleId, vehicles.id))
    .where(and(eq(serviceRecords.id, id), eq(vehicles.userId, user.user.id)))
    .limit(1);

  if (!serviceRecord) return { error: "Service record not found" };

  await db
    .update(serviceRecords)
    .set({
      ...record,
      odometer: Math.round(
        convert(
          record.odometer as number,
          user.preferences.lengthUnits === "metric" ? "km" : "mi"
        ).to("mi")
      ),
    })
    .where(eq(serviceRecords.id, id));

  return null;
}

export async function deleteServiceRecord(id: string) {
  const user = await validateUser();
  if (!user || !user.user || !user.preferences)
    return { error: "User not found" };

  const [serviceRecord] = await db
    .select()
    .from(serviceRecords)
    .leftJoin(vehicles, eq(serviceRecords.vehicleId, vehicles.id))
    .where(and(eq(serviceRecords.id, id), eq(vehicles.userId, user.user.id)))
    .limit(1);

  if (!serviceRecord) return { error: "Service record not found" };

  await db.delete(serviceRecords).where(eq(serviceRecords.id, id));

  return null;
}
