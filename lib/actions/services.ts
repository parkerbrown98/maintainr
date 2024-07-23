"use server";

import { ServiceRecordInsert, serviceRecords } from "@/drizzle/schema";
import { db } from "../db";

export async function createServiceRecord(record: ServiceRecordInsert) {
  // TODO: Check ownership of vehicle
  await db.insert(serviceRecords).values(record);
  return null;
}
