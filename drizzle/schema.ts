import { SERVICE_TYPES } from "@/lib/constants";
import { desc, relations } from "drizzle-orm";
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
  preferences: one(userPreferences),
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

export const unitTypeEnum = pgEnum("unit_type", ["imperial", "metric"]);

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  language: varchar("language", { length: 100 }).notNull().default("en"),
  lengthUnits: unitTypeEnum("length_units").notNull().default("imperial"),
  volumeUnits: unitTypeEnum("volume_units").notNull().default("imperial"),
  weightUnits: unitTypeEnum("weight_units").notNull().default("imperial"),
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type UserPreferencesInsert = typeof userPreferences.$inferInsert;

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

export const uploads = pgTable("uploads", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  serviceRecordId: uuid("service_record_id").references(
    () => serviceRecords.id
  ),
  fileName: varchar("file_name", { length: 100 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  url: varchar("url", { length: 100 }).notNull(),
  size: integer("size").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Upload = typeof uploads.$inferSelect;
export type UploadInsert = typeof uploads.$inferInsert;

export const fuelTypes = pgTable("fuel_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const fuelRecords = pgTable("fuel_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
  fuelType: uuid("fuel_type_id")
    .notNull()
    .references(() => fuelTypes.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 2 }),
  odometer: integer("odometer"),
  description: text("description"),
  recordedAt: timestamp("recorded_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type FuelRecord = typeof fuelRecords.$inferSelect;
export type FuelRecordInsert = typeof fuelRecords.$inferInsert;
