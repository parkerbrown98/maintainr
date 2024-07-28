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

export async function createServiceRecord(record: ServiceRecordInsert) {
  const user = await validateUser();
  if (!user || !user.user || !user.preferences) return null;

  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(
      and(eq(vehicles.id, record.vehicleId), eq(vehicles.userId, user.user.id))
    )
    .limit(1);

  if (!vehicle) return { error: "Vehicle not found" };

  await db.insert(serviceRecords).values(record);
  return null;
}

export async function updateServiceRecord(
  id: string,
  record: Partial<ServiceRecord>
) {
  const user = await validateUser();
  if (!user || !user.user || !user.preferences) return null;

  const [serviceRecord] = await db
    .select()
    .from(serviceRecords)
    .leftJoin(vehicles, eq(serviceRecords.vehicleId, vehicles.id))
    .where(and(eq(serviceRecords.id, id), eq(vehicles.userId, user.user.id)))
    .limit(1);

  if (!serviceRecord) return { error: "Service record not found" };

  await db.update(serviceRecords).set(record).where(eq(serviceRecords.id, id));

  return null;
}

export async function deleteServiceRecord(id: string) {
  const user = await validateUser();
  if (!user || !user.user || !user.preferences) return null;

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
