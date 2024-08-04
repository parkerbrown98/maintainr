import { odometerReadings, vehicles } from "@/drizzle/schema";
import { db } from "../db";
import { and, desc, eq, sql } from "drizzle-orm";

interface DistanceDrivenPerMonth {
  month_text: string;
  distance: number;
}

export async function getDistanceDrivenPerMonth(userId: string, year: number) {
  const query = await db.execute(
    sql`
        WITH months AS (
            SELECT generate_series(1, 12) AS month
        ),
        odometer_data AS (
            SELECT
                ${odometerReadings.vehicleId},
                EXTRACT(YEAR FROM ${odometerReadings.recordedAt}) AS year,
                EXTRACT(MONTH FROM ${odometerReadings.recordedAt}) AS month,
                MIN(${odometerReadings.reading}) AS min_reading,
                MAX(${odometerReadings.reading}) AS max_reading
            FROM ${odometerReadings}
            JOIN ${vehicles} ON ${odometerReadings.vehicleId} = ${vehicles.id}
            WHERE
                ${vehicles.userId} = ${userId} AND
                EXTRACT(YEAR FROM ${odometerReadings.recordedAt}) = ${year}
            GROUP BY
                ${odometerReadings.vehicleId},
                EXTRACT(YEAR FROM ${odometerReadings.recordedAt}),
                EXTRACT(MONTH FROM ${odometerReadings.recordedAt})
        ),
        aggregated_data AS (
            SELECT month, SUM(max_reading - min_reading) AS distance_driven
            FROM odometer_data
            GROUP BY month
        )
        SELECT
            TO_CHAR(TO_DATE(months.month::text, 'MM'), 'Month') AS month_text,
            COALESCE(CAST(aggregated_data.distance_driven AS INTEGER), 0) AS distance
        FROM
            months
        LEFT JOIN
            aggregated_data ON months.month = aggregated_data.month
        ORDER BY
            months.month;
        `
  );

  return query.rows as unknown as DistanceDrivenPerMonth[];
}

interface ReadingWithDelta {
  user_id: string;
  make: string;
  model: string;
  year: number;
  vehicle_id: string;
  recorded_at: Date;
  reading: number;
  delta: number;
}

export async function getReadingsWithDelta(userId: string) {
  const query = await db.execute(
    sql`
        SELECT
            v.user_id,
            v.make,
            v.model,
            v.year,
            v.vehicle_id,
            v.recorded_at,
            v.reading,
            v.reading - LAG(v.reading, 1) OVER (PARTITION BY v.vehicle_id ORDER BY v.recorded_at) AS delta
        FROM (
            SELECT
                ${vehicles.userId} AS user_id,
                ${vehicles.make},
                ${vehicles.model},
                ${vehicles.year},
                ${odometerReadings.vehicleId} AS vehicle_id,
                ${odometerReadings.recordedAt} AS recorded_at,
                ${odometerReadings.reading} AS reading
            FROM ${odometerReadings}
            JOIN ${vehicles} ON ${odometerReadings.vehicleId} = ${vehicles.id}
            WHERE ${vehicles.userId} = ${userId}
        ) v
        ORDER BY v.recorded_at DESC
        LIMIT 10;
        `
  );

  return query.rows as unknown as ReadingWithDelta[];
}
