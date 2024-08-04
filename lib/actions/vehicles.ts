"use server";

import {
  odometerReadings,
  uploads,
  users,
  VehicleInsert,
  vehicles,
} from "@/drizzle/schema";
import { db } from "../db";
import { validateUser } from "../auth";
import { and, eq } from "drizzle-orm";
import convert from "convert";
import { saveFileToDisk } from "./uploads";

export async function createVehicle(
  vehicle: VehicleInsert & { odometer: number }
) {
  const user = await validateUser();
  if (!user || !user.user) return { error: "User not found" };

  if (vehicle.odometer < 0)
    return { error: "Odometer reading cannot be negative" };

  if (vehicle.year < 1900 || vehicle.year > new Date().getFullYear())
    return { error: "Invalid year" };

  if (vehicle.userId !== user.user.id) return { error: "Invalid user ID" };

  const [createdVehicle] = await db
    .insert(vehicles)
    .values(vehicle)
    .returning();

  if (!createdVehicle) return { error: "Failed to create new vehicle" };

  await db.insert(odometerReadings).values({
    vehicleId: createdVehicle.id,
    reading: Math.round(
      convert(
        vehicle.odometer,
        user.preferences.lengthUnits === "metric" ? "km" : "mi"
      ).to("mi")
    ),
    recordedAt: new Date(),
  });

  return null;
}

export async function editVehicle(
  vehicleId: string,
  vehicle: Omit<VehicleInsert, "userId">
) {
  const user = await validateUser();
  if (!user || !user.user) return { error: "User not found" };

  if (vehicle.year < 1900 || vehicle.year > new Date().getFullYear())
    return { error: "Invalid year" };

  await db
    .update(vehicles)
    .set(vehicle)
    .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.user.id)));

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

export async function addVehicleUpload(formData: FormData) {
  const user = await validateUser();
  if (!user || !user.user || !user.preferences)
    return { error: "User not found" };

  if (!formData.has("vehicleId") || !formData.has("files"))
    return { error: "Missing required fields" };

  const vehicleId = formData.get("vehicleId") as string;
  const files = formData.getAll("files") as File[];

  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.user.id)))
    .limit(1);

  if (!vehicle) return { error: "Vehicle not found" };

  for (const file of files) {
    let fileName = file.name.replaceAll(" ", "_");

    // Insert a random string to avoid overwriting files with the same name
    const randomString = Math.random().toString(36).substring(7);
    fileName = `${randomString}_${fileName}`;

    const filePath = await saveFileToDisk(fileName, file);

    await db.insert(uploads).values({
      fileName,
      vehicleId,
      mimeType: file.type,
      userId: user.user.id,
      size: file.size,
      url: filePath,
    });
  }

  return null;
}
