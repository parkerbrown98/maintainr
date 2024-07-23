"use server";

import { odometerReadings, VehicleInsert, vehicles } from "@/drizzle/schema";
import { db } from "../db";

export async function createVehicle(vehicle: VehicleInsert & { odometer: number }) {
    const [createdVehicle] = await db.insert(vehicles).values(vehicle).returning();

    if (!createdVehicle) return { error: "Failed to create new vehicle" };

    await db.insert(odometerReadings).values({
        vehicleId: createdVehicle.id,
        reading: vehicle.odometer,
        recordedAt: new Date(),
    });

    return null;
}