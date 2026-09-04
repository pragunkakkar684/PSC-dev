ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "client_name" varchar(200);
ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "client_title" varchar(300);
ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "rating" integer DEFAULT 5 NOT NULL;
ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "image_url" varchar(1000);
ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;