"use server";

import {
  ServiceRecord,
  ServiceRecordInsert,
  serviceRecords,
  uploads,
  vehicles,
} from "@/drizzle/schema";
import { db } from "../db";
import { and, eq } from "drizzle-orm";
import { validateUser } from "../auth";
import convert from "convert";
import { saveFileToDisk } from "./uploads";

export async function createServiceRecord(form: FormData) {
  if (
    !form.has("vehicleId") ||
    !form.has("serviceType") ||
    !form.has("serviceDate")
  ) {
    return { error: "Missing required fields" };
  }

  const vehicleId = form.get("vehicleId") as string;
  const serviceType = form.get("serviceType") as string;
  const serviceDate = new Date(form.get("serviceDate") as string);
  const odometer = form.has("odometer")
    ? parseInt(form.get("odometer") as string)
    : undefined;
  const description = form.has("description")
    ? (form.get("description") as string)
    : undefined;
  const files = form.getAll("attachments") as File[];

  const user = await validateUser();
  if (!user || !user.user || !user.preferences)
    return { error: "User not found" };

  if (odometer && odometer < 0)
    return { error: "Odometer reading cannot be negative" };

  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.user.id)))
    .limit(1);

  if (!vehicle) return { error: "Vehicle not found" };

  const [service] = await db
    .insert(serviceRecords)
    .values({
      vehicleId,
      serviceType,
      serviceDate,
      odometer: odometer
        ? Math.round(
            convert(
              odometer as number,
              user.preferences.lengthUnits === "metric" ? "km" : "mi"
            ).to("mi")
          )
        : undefined,
      description,
    })
    .returning();

  if (!service) return { error: "Failed to create service record" };

  for (const file of files) {
    const filePath = await saveFileToDisk(file);
    await db.insert(uploads).values({
      fileName: file.name,
      mimeType: file.type,
      userId: user.user.id,
      size: file.size,
      url: filePath,
      serviceRecordId: service.id,
      vehicleId: vehicleId,
    });
  }

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
