CREATE TABLE "accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(300) NOT NULL,
	"company" varchar(300),
	"email" varchar(320) NOT NULL,
	"phone" varchar(100),
	"practice_area" varchar(200),
	"message" text NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(50) DEFAULT 'new' NOT NULL,
	"ip_address" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "event_agenda_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"time_label" varchar(50),
	"title" varchar(200) NOT NULL,
	"description" text,
	"is_current" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_speakers" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"team_member_id" integer,
	"external_speaker_name" varchar(200),
	"external_speaker_role" varchar(300),
	"external_speaker_image_url" varchar(1000),
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(200) NOT NULL,
	"event_type" varchar(50),
	"title" varchar(500) NOT NULL,
	"description" text,
	"date" date,
	"time_start" time,
	"time_end" time,
	"timezone" varchar(100),
	"location" varchar(300),
	"platform" varchar(200),
	"duration_label" varchar(50),
	"registration_url" varchar(1000),
	"agenda_file_url" varchar(1000),
	"image_url" varchar(1000),
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_highlighted" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"status" varchar(20) DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"page_context" varchar(100) DEFAULT 'general' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_slug" varchar(100) NOT NULL,
	"eyebrow" varchar(200),
	"heading" text,
	"subheading" text,
	"image_url" varchar(1000),
	"cta1_text" varchar(100),
	"cta1_href" varchar(500),
	"cta2_text" varchar(100),
	"cta2_href" varchar(500),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hero_sections_page_slug_unique" UNIQUE("page_slug")
);
--> statement-breakpoint
CREATE TABLE "industries" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"short_description" text,
	"image_url" varchar(1000),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "industries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "insights_articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(300) NOT NULL,
	"content_type" varchar(50) DEFAULT 'article' NOT NULL,
	"tag" varchar(100),
	"title" varchar(500) NOT NULL,
	"summary" text,
	"body" text,
	"image_url" varchar(1000),
	"file_url" varchar(1000),
	"read_time_mins" integer,
	"authority_tag" varchar(100),
	"court_name" varchar(300),
	"published_at" timestamp,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"author_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "insights_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "legacy_timeline" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" varchar(10) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"cloudinary_id" varchar(500) NOT NULL,
	"url" varchar(1000) NOT NULL,
	"resource_type" varchar(20) DEFAULT 'image' NOT NULL,
	"original_name" varchar(500),
	"mime_type" varchar(100),
	"size_bytes" integer,
	"folder" varchar(200),
	"uploaded_by" text,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_files_cloudinary_id_unique" UNIQUE("cloudinary_id")
);
--> statement-breakpoint
CREATE TABLE "nav_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar(100) NOT NULL,
	"href" varchar(500) DEFAULT '#' NOT NULL,
	"menu_key" varchar(50),
	"menu_type" varchar(20),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(320) NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"unsubscribed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "office_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"city" varchar(100) NOT NULL,
	"full_address" text,
	"phone" varchar(100),
	"email" varchar(320),
	"is_headquarters" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_area_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"practice_area_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"number" varchar(5),
	"name" varchar(200) NOT NULL,
	"short_description" text,
	"long_description" text,
	"icon_name" varchar(100),
	"style_class" varchar(200),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "practice_areas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"site_name" varchar(100) DEFAULT 'PSC Global' NOT NULL,
	"tagline" text,
	"footer_description" text,
	"copyright_text" varchar(200),
	"contact_email_general" varchar(320),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"number_display" varchar(50) NOT NULL,
	"label" varchar(200) NOT NULL,
	"icon_name" varchar(100),
	"context" varchar(100) DEFAULT 'global' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_member_expertise" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_member_id" integer NOT NULL,
	"icon_name" varchar(100),
	"title" varchar(200) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"role_title" varchar(300),
	"category" varchar(50) DEFAULT 'partner' NOT NULL,
	"focus_area" varchar(300),
	"short_bio" text,
	"long_bio_sections" jsonb,
	"image_url" varchar(1000),
	"email" varchar(320),
	"location" varchar(200),
	"years_experience" varchar(50),
	"quote" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_members_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"quote" text NOT NULL,
	"person_name" varchar(200),
	"person_title" varchar(200),
	"company_name" varchar(200),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(320) NOT NULL,
	"email_verified" timestamp,
	"password" varchar(255),
	"image" varchar(1000),
	"role" varchar(20) DEFAULT 'editor' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_agenda_items" ADD CONSTRAINT "event_agenda_items_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_speakers" ADD CONSTRAINT "event_speakers_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_speakers" ADD CONSTRAINT "event_speakers_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insights_articles" ADD CONSTRAINT "insights_articles_author_id_team_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_area_services" ADD CONSTRAINT "practice_area_services_practice_area_id_practice_areas_id_fk" FOREIGN KEY ("practice_area_id") REFERENCES "public"."practice_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member_expertise" ADD CONSTRAINT "team_member_expertise_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_email_idx" ON "newsletter_subscribers" USING btree ("email");