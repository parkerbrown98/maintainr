DO $$ BEGIN
 CREATE TYPE "public"."service_type" AS ENUM('oil_change', 'tire_rotation', 'brakes', 'battery_replacement', 'air_filter_replacement', 'cabin_filter_replacement', 'fuel_filter_replacement', 'spark_plug_replacement', 'coolant_flush', 'transmission_service', 'wheel_alignment', 'tire_balancing', 'suspension_repair', 'exhaust_system_repair', 'air_conditioning_service', 'engine_tune_up', 'timing_belt_replacement', 'drive_belt_replacement', 'brake_fluid_flush', 'power_steering_fluid_service', 'wiper_blade_replacement', 'headlight_replacement', 'taillight_replacement', 'window_repair', 'door_lock_repair', 'electrical_system_repair', 'diagnostic_service', 'emission_test', 'state_inspection', 'roadside_assistance', 'car_wash', 'detailing', 'paint_touch_up', 'rust_protection', 'undercoating', 'fuel_system_service', 'differential_service', 'transfer_case_service', 'software_update', 'recall_service', 'audio_system_service', 'navigation_system_service', 'key_fob_battery_replacement', 'remote_start_installation', 'dash_cam_installation', 'performance_upgrade', 'body_repair', 'windshield_replacement', 'interior_repair', 'tire_repair', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"description" text,
	"service_type" "service_type" NOT NULL,
	"service_date" timestamp NOT NULL,
	"cost" numeric(10, 2) NOT NULL,
	"odometer" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_records" ADD CONSTRAINT "service_records_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
