CREATE SCHEMA "music";
--> statement-breakpoint
CREATE TYPE "music"."account_provider" AS ENUM('spotify');--> statement-breakpoint
CREATE TYPE "music"."album_primary_type" AS ENUM('album', 'single', 'ep', 'broadcast', 'other');--> statement-breakpoint
CREATE TYPE "music"."album_secondary_type" AS ENUM('compilation', 'soundtrack', 'spokenword', 'interview', 'audiobook', 'audio_drama', 'live', 'remix', 'dj_mix', 'mixtape', 'demo', 'field_recording');--> statement-breakpoint
CREATE TYPE "music"."artist_gender" AS ENUM('male', 'female', 'other', 'not_applicable');--> statement-breakpoint
CREATE TYPE "music"."artist_type" AS ENUM('person', 'group', 'orchestra', 'choir', 'character', 'other');--> statement-breakpoint
CREATE TYPE "music"."job_status" AS ENUM('queued', 'processing', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "music"."label_type" AS ENUM('imprint', 'original_production', 'bootleg_production', 'reissue_production', 'distributor', 'holding', 'rights_society');--> statement-breakpoint
CREATE TYPE "music"."sync_status" AS ENUM('idle', 'syncing', 'failed');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"username" text,
	"display_username" text,
	"is_public" boolean DEFAULT false,
	"locale" text DEFAULT 'en' NOT NULL,
	"time_format" text DEFAULT '12h' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"registration_mode" text DEFAULT 'open' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invites_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "music"."album_artists" (
	"album_id" uuid NOT NULL,
	"artist_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT true NOT NULL,
	"order" integer NOT NULL,
	"join_phrase" text,
	CONSTRAINT "album_artists_pk" PRIMARY KEY("album_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE "music"."album_genres" (
	"album_id" uuid NOT NULL,
	"genre_id" uuid NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "album_genres_pk" PRIMARY KEY("album_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "music"."album_labels" (
	"album_id" uuid NOT NULL,
	"label_id" uuid NOT NULL,
	"catalog_number" text,
	CONSTRAINT "album_labels_pk" PRIMARY KEY("album_id","label_id")
);
--> statement-breakpoint
CREATE TABLE "music"."albums" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"release_date" date,
	"first_release_date" date,
	"primary_type" "music"."album_primary_type",
	"secondary_types" "music"."album_secondary_type"[],
	"country" text,
	"mb_id" uuid,
	"image_url" text,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "albums_mb_id_unique" UNIQUE("mb_id")
);
--> statement-breakpoint
CREATE TABLE "music"."albums_alias" (
	"id" uuid PRIMARY KEY NOT NULL,
	"album_id" uuid NOT NULL,
	"alias" text NOT NULL,
	"sort_name" text,
	"is_primary" boolean NOT NULL,
	"locale" text
);
--> statement-breakpoint
CREATE TABLE "music"."artist_genres" (
	"artist_id" uuid NOT NULL,
	"genre_id" uuid NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "artist_genres_pk" PRIMARY KEY("artist_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "music"."artists" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sort_name" text,
	"mb_id" uuid,
	"image_url" text,
	"type" "music"."artist_type",
	"gender" "music"."artist_gender",
	"country" text,
	"begin_date" date,
	"end_date" date,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "artists_mb_id_unique" UNIQUE("mb_id")
);
--> statement-breakpoint
CREATE TABLE "music"."artists_alias" (
	"id" uuid PRIMARY KEY NOT NULL,
	"artist_id" uuid NOT NULL,
	"alias" text NOT NULL,
	"sort_name" text,
	"is_primary" boolean NOT NULL,
	"locale" text
);
--> statement-breakpoint
CREATE TABLE "music"."artists_groups" (
	"member_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"start_date" date,
	"end_date" date,
	CONSTRAINT "artists_groups_pk" PRIMARY KEY("member_id","group_id")
);
--> statement-breakpoint
CREATE TABLE "music"."enrichment_jobs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"artist_id" uuid,
	"album_id" uuid,
	"track_id" uuid,
	"status" "music"."job_status" DEFAULT 'queued' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"max_retries" integer DEFAULT 3 NOT NULL,
	"error_message" text,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "music"."genres" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"mb_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "genres_name_unique" UNIQUE("name"),
	CONSTRAINT "genres_mb_id_unique" UNIQUE("mb_id")
);
--> statement-breakpoint
CREATE TABLE "music"."import_jobs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"filename" text NOT NULL,
	"file_hash" text NOT NULL,
	"file_size" bigint NOT NULL,
	"file_path" text NOT NULL,
	"status" "music"."job_status" DEFAULT 'queued' NOT NULL,
	"total_records" integer,
	"imported_records" integer DEFAULT 0 NOT NULL,
	"failed_records" integer DEFAULT 0 NOT NULL,
	"error_message" jsonb,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "music"."labels" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sort_name" text,
	"mb_id" uuid,
	"label_code" text,
	"type" "music"."label_type",
	"country" text,
	"begin_date" date,
	"end_date" date,
	"comment" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "labels_mb_id_unique" UNIQUE("mb_id")
);
--> statement-breakpoint
CREATE TABLE "music"."plays" (
	"id" bigint PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "music"."plays_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"track_id" uuid NOT NULL,
	"album_id" uuid,
	"import_job_id" uuid,
	"played_at" timestamp with time zone NOT NULL,
	"played_duration_ms" integer NOT NULL,
	"skipped" boolean DEFAULT false NOT NULL,
	"provider" "music"."account_provider" NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "music"."provider_album_mappings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"album_id" uuid NOT NULL,
	"provider" "music"."account_provider" NOT NULL,
	"external_id" text NOT NULL,
	"external_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "music"."provider_artist_mappings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"artist_id" uuid NOT NULL,
	"provider" "music"."account_provider" NOT NULL,
	"external_id" text NOT NULL,
	"external_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "music"."provider_sync_state" (
	"user_id" text NOT NULL,
	"provider" "music"."account_provider" NOT NULL,
	"last_synced_at" timestamp with time zone,
	"sync_status" "music"."sync_status" DEFAULT 'idle' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "provider_sync_state_pk" PRIMARY KEY("user_id","provider")
);
--> statement-breakpoint
CREATE TABLE "music"."provider_track_mappings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"track_id" uuid NOT NULL,
	"provider" "music"."account_provider" NOT NULL,
	"external_id" text NOT NULL,
	"external_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "music"."track_albums" (
	"track_id" uuid NOT NULL,
	"album_id" uuid NOT NULL,
	"disc_number" integer,
	"position" integer,
	CONSTRAINT "track_albums_pk" PRIMARY KEY("track_id","album_id")
);
--> statement-breakpoint
CREATE TABLE "music"."track_artists" (
	"track_id" uuid NOT NULL,
	"artist_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT true NOT NULL,
	"order" integer NOT NULL,
	"join_phrase" text,
	CONSTRAINT "track_artists_pk" PRIMARY KEY("track_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE "music"."track_genres" (
	"track_id" uuid NOT NULL,
	"genre_id" uuid NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "track_genres_pk" PRIMARY KEY("track_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "music"."tracks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"duration_ms" integer,
	"mb_id" uuid,
	"isrc" text,
	"explicit" boolean NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "tracks_mb_id_unique" UNIQUE("mb_id"),
	CONSTRAINT "tracks_isrc_unique" UNIQUE("isrc")
);
--> statement-breakpoint
CREATE TABLE "music"."tracks_alias" (
	"id" uuid PRIMARY KEY NOT NULL,
	"track_id" uuid NOT NULL,
	"alias" text NOT NULL,
	"sort_name" text,
	"is_primary" boolean NOT NULL,
	"locale" text
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."album_artists" ADD CONSTRAINT "album_artists_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "music"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."album_artists" ADD CONSTRAINT "album_artists_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "music"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."album_genres" ADD CONSTRAINT "album_genres_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "music"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."album_genres" ADD CONSTRAINT "album_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "music"."genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."album_labels" ADD CONSTRAINT "album_labels_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "music"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."album_labels" ADD CONSTRAINT "album_labels_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "music"."labels"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."albums_alias" ADD CONSTRAINT "albums_alias_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "music"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."artist_genres" ADD CONSTRAINT "artist_genres_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "music"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."artist_genres" ADD CONSTRAINT "artist_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "music"."genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."artists_alias" ADD CONSTRAINT "artists_alias_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "music"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."artists_groups" ADD CONSTRAINT "artists_groups_member_id_artists_id_fk" FOREIGN KEY ("member_id") REFERENCES "music"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."artists_groups" ADD CONSTRAINT "artists_groups_group_id_artists_id_fk" FOREIGN KEY ("group_id") REFERENCES "music"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."enrichment_jobs" ADD CONSTRAINT "enrichment_jobs_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "music"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."enrichment_jobs" ADD CONSTRAINT "enrichment_jobs_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "music"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."enrichment_jobs" ADD CONSTRAINT "enrichment_jobs_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "music"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."import_jobs" ADD CONSTRAINT "import_jobs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."plays" ADD CONSTRAINT "plays_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."plays" ADD CONSTRAINT "plays_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "music"."tracks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."plays" ADD CONSTRAINT "plays_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "music"."albums"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."plays" ADD CONSTRAINT "plays_import_job_id_import_jobs_id_fk" FOREIGN KEY ("import_job_id") REFERENCES "music"."import_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."provider_album_mappings" ADD CONSTRAINT "provider_album_mappings_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "music"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."provider_artist_mappings" ADD CONSTRAINT "provider_artist_mappings_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "music"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."provider_sync_state" ADD CONSTRAINT "provider_sync_state_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."provider_track_mappings" ADD CONSTRAINT "provider_track_mappings_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "music"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."track_albums" ADD CONSTRAINT "track_albums_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "music"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."track_albums" ADD CONSTRAINT "track_albums_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "music"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."track_artists" ADD CONSTRAINT "track_artists_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "music"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."track_artists" ADD CONSTRAINT "track_artists_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "music"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."track_genres" ADD CONSTRAINT "track_genres_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "music"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."track_genres" ADD CONSTRAINT "track_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "music"."genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music"."tracks_alias" ADD CONSTRAINT "tracks_alias_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "music"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "idx_album_artists_reverse" ON "music"."album_artists" USING btree ("artist_id");--> statement-breakpoint
CREATE INDEX "idx_album_genres_reverse" ON "music"."album_genres" USING btree ("genre_id");--> statement-breakpoint
CREATE INDEX "idx_album_labels_reverse" ON "music"."album_labels" USING btree ("label_id");--> statement-breakpoint
CREATE INDEX "idx_albums_title" ON "music"."albums" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_albums_primary_type" ON "music"."albums" USING btree ("primary_type");--> statement-breakpoint
CREATE INDEX "idx_albums_first_release" ON "music"."albums" USING btree ("first_release_date");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_album_alias_unique" ON "music"."albums_alias" USING btree ("album_id","alias");--> statement-breakpoint
CREATE INDEX "idx_artist_genres_reverse" ON "music"."artist_genres" USING btree ("genre_id");--> statement-breakpoint
CREATE INDEX "idx_artists_name" ON "music"."artists" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_artists_country" ON "music"."artists" USING btree ("country");--> statement-breakpoint
CREATE INDEX "idx_artist_alias_search" ON "music"."artists_alias" USING btree ("alias");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_artist_alias_unique" ON "music"."artists_alias" USING btree ("artist_id","alias");--> statement-breakpoint
CREATE INDEX "idx_artists_groups_reverse" ON "music"."artists_groups" USING btree ("group_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_enrichment_artist" ON "music"."enrichment_jobs" USING btree ("artist_id") WHERE "music"."enrichment_jobs"."status" in ('queued', 'processing');--> statement-breakpoint
CREATE UNIQUE INDEX "idx_enrichment_album" ON "music"."enrichment_jobs" USING btree ("album_id") WHERE "music"."enrichment_jobs"."status" in ('queued', 'processing');--> statement-breakpoint
CREATE UNIQUE INDEX "idx_enrichment_track" ON "music"."enrichment_jobs" USING btree ("track_id") WHERE "music"."enrichment_jobs"."status" in ('queued', 'processing');--> statement-breakpoint
CREATE INDEX "idx_enrichment_queue" ON "music"."enrichment_jobs" USING btree ("status","priority");--> statement-breakpoint
CREATE INDEX "idx_enrichment_status" ON "music"."enrichment_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_imports_user" ON "music"."import_jobs" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_imports_user_file_hash" ON "music"."import_jobs" USING btree ("user_id","file_hash");--> statement-breakpoint
CREATE INDEX "idx_imports_status" ON "music"."import_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_labels_name" ON "music"."labels" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_labels_country" ON "music"."labels" USING btree ("country");--> statement-breakpoint
CREATE UNIQUE INDEX "no_duplicate_scrobbles" ON "music"."plays" USING btree ("user_id","track_id","played_at") WHERE "music"."plays"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "idx_plays_user_time" ON "music"."plays" USING btree ("user_id","played_at") WHERE "music"."plays"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "idx_plays_album" ON "music"."plays" USING btree ("album_id") WHERE "music"."plays"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "idx_plays_track" ON "music"."plays" USING btree ("track_id") WHERE "music"."plays"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "idx_scrobbles_import" ON "music"."plays" USING btree ("import_job_id") WHERE "music"."plays"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "idx_plays_deleted" ON "music"."plays" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_provider_album_unique" ON "music"."provider_album_mappings" USING btree ("provider","external_id");--> statement-breakpoint
CREATE INDEX "idx_album_provider" ON "music"."provider_album_mappings" USING btree ("album_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_provider_artist_unique" ON "music"."provider_artist_mappings" USING btree ("provider","external_id");--> statement-breakpoint
CREATE INDEX "idx_artist_provider" ON "music"."provider_artist_mappings" USING btree ("artist_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_provider_track_unique" ON "music"."provider_track_mappings" USING btree ("provider","external_id");--> statement-breakpoint
CREATE INDEX "idx_track_provider" ON "music"."provider_track_mappings" USING btree ("track_id","provider");--> statement-breakpoint
CREATE INDEX "idx_track_albums_reverse" ON "music"."track_albums" USING btree ("album_id");--> statement-breakpoint
CREATE INDEX "idx_track_artists_reverse" ON "music"."track_artists" USING btree ("artist_id");--> statement-breakpoint
CREATE INDEX "idx_track_genres_reverse" ON "music"."track_genres" USING btree ("genre_id");--> statement-breakpoint
CREATE INDEX "idx_tracks_title" ON "music"."tracks" USING btree ("title");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_track_alias_unique" ON "music"."tracks_alias" USING btree ("track_id","alias");