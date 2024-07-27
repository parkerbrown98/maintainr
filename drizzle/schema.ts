import { SERVICE_TYPES } from "@/lib/constants";
import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  uuid,
  timestamp,
  text,
  pgEnum,
  decimal,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  selectedVehicleId: uuid("selected_vehicle_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
  selectedVehicle: one(vehicles, {
    fields: [users.selectedVehicleId],
    references: [vehicles.id],
  }),
}));

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  make: varchar("make", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  vin: varchar("vin", { length: 17 }),
  licensePlate: varchar("license_plate", { length: 10 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type VehicleInsert = typeof vehicles.$inferInsert;

export const odometerReadings = pgTable("odometer_readings", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
  reading: integer("reading").notNull(),
  recordedAt: timestamp("recorded_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type OdometerReading = typeof odometerReadings.$inferSelect;
export type OdometerReadingInsert = typeof odometerReadings.$inferInsert;

export const serviceTypeEnum = pgEnum("service_type", [
  Object.keys(SERVICE_TYPES)[0],
  ...Object.keys(SERVICE_TYPES).slice(1),
]);

export const serviceRecords = pgTable("service_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
  description: text("description"),
  serviceType: serviceTypeEnum("service_type").notNull(),
  serviceDate: timestamp("service_date").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  odometer: integer("odometer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ServiceRecord = typeof serviceRecords.$inferSelect;
export type ServiceRecordInsert = typeof serviceRecords.$inferInsert;
