DO $$ BEGIN
 CREATE TYPE "public"."unit_type" AS ENUM('imperial', 'metric');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"language" varchar(100) DEFAULT 'en' NOT NULL,
	"length_units" "unit_type" DEFAULT 'imperial' NOT NULL,
	"volume_units" "unit_type" DEFAULT 'imperial' NOT NULL,
	"weight_units" "unit_type" DEFAULT 'imperial' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
