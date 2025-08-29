CREATE TABLE "dictionary" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" varchar(19) NOT NULL,
	"creater_id" varchar(19) NOT NULL,
	"before_word" text NOT NULL,
	"after_word" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dictionary_enable" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(19) NOT NULL,
	"dictionary_id" integer NOT NULL,
	"disabled" boolean NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "guild_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(19) NOT NULL,
	"text_length" integer DEFAULT 50 NOT NULL,
	"in_voice_only" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "speaker_emotion_master" (
	"id" integer PRIMARY KEY NOT NULL,
	"speaker" varchar,
	"emotion" varchar
);
--> statement-breakpoint
CREATE TABLE "users_voice_preference" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" varchar(19) NOT NULL,
	"user_id" varchar(19) NOT NULL,
	"speakerId" integer NOT NULL,
	"emotion_level" double precision NOT NULL,
	"pitch" double precision NOT NULL,
	"speed" double precision NOT NULL,
	"is_mnuted" boolean NOT NULL,
	"is_self_edited" boolean NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "voice_connection" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(19) NOT NULL,
	"text_id" varchar(19) NOT NULL,
	"voice_id" varchar(19) NOT NULL,
	"isAutoConnect" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_preference" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(19) NOT NULL,
	"speakerId" integer NOT NULL,
	"emotion_level" double precision NOT NULL,
	"pitch" double precision NOT NULL,
	"speed" double precision NOT NULL,
	"text_length" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "parent_user_idx" ON "users_voice_preference" USING btree ("parent_id","user_id");--> statement-breakpoint
CREATE INDEX "user_idx" ON "voice_preference" USING btree ("user_id");