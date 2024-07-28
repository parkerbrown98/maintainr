"use server";

import { ServiceRecordInsert, serviceRecords } from "@/drizzle/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function createServiceRecord(record: ServiceRecordInsert) {
  // TODO: Check ownership of vehicle
  await db.insert(serviceRecords).values(record);
  return null;
}

export async function deleteServiceRecord(id: string) {
  // TODO: Check ownership of vehicle
  await db.delete(serviceRecords).where(eq(serviceRecords.id, id));
  return null;
}