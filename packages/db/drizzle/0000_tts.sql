CREATE TABLE "dictionary" (
	"id" serial PRIMARY KEY NOT NULL,
	"creater_id" varchar(19) NOT NULL,
	"before_word" text NOT NULL,
	"after_word" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "guild_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(19) NOT NULL,
	"text_length" integer DEFAULT 50 NOT NULL,
	"isAutoConnect" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "speaker_emotion_master" (
	"id" integer PRIMARY KEY NOT NULL,
	"speaker" varchar NOT NULL,
	"emotion" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_connection" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(19) NOT NULL,
	"text_id" varchar(19) NOT NULL,
	"voice_id" varchar(19) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(19) NOT NULL,
	"use_vv" boolean NOT NULL,
	"vv_id" integer,
	"vt_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "voice_info_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "vt_voice_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(19) NOT NULL,
	"speakerId" integer NOT NULL,
	"emotion_level" integer NOT NULL,
	"pitch" integer NOT NULL,
	"speed" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "vt_voice_info_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "vv_voice_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(19) NOT NULL,
	"speakerId" integer NOT NULL,
	"intnation" double precision DEFAULT 1 NOT NULL,
	"pitch" double precision NOT NULL,
	"speed" double precision NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "vv_voice_info_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE INDEX "dictionary_before_word_idx" ON "dictionary" USING btree ("before_word");--> statement-breakpoint
CREATE INDEX "voice_connection_voice_idx" ON "voice_connection" USING btree ("voice_id");--> statement-breakpoint
CREATE INDEX "voice_connection_text_idx" ON "voice_connection" USING btree ("text_id");--> statement-breakpoint
CREATE INDEX "voice_main_user_idx" ON "voice_info" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vt_user_idx" ON "vt_voice_info" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vv_user_idx" ON "vv_voice_info" USING btree ("user_id");