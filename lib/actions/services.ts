"use server";

import fs from "fs";
import path from "path";
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
  const cost = form.get("cost") as string;
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
      cost,
      description,
    })
    .returning();

  if (!service) return { error: "Failed to create service record" };

  for (const file of files) {
    let fileName = file.name.replaceAll(" ", "_");

    // Insert a random string to avoid overwriting files with the same name
    const randomString = Math.random().toString(36).substring(7);
    fileName = `${randomString}_${fileName}`;

    const filePath = await saveFileToDisk(fileName, file);

    await db.insert(uploads).values({
      fileName,
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

  // Delete all uploads associated with this service record
  const uploadsToDelete = await db
    .select()
    .from(uploads)
    .where(eq(uploads.serviceRecordId, id));

  for (const upload of uploadsToDelete) {
    try {
      fs.unlinkSync(path.join(process.cwd(), upload.url));
    } catch (err) {
      return { error: "Failed to delete file from filesystem" };
    }

    await db.delete(uploads).where(eq(uploads.id, upload.id));
  }

  await db.delete(serviceRecords).where(eq(serviceRecords.id, id));

  return null;
}
