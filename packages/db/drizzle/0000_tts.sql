drop table tts.dictionary;
drop table tts.dictionary_enable;
drop table tts.speaker_emotion_master;
drop table tts.users_voice_preference;
drop table tts.voice_preference;


CREATE TABLE "tts"."dictionary" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" varchar(19) NOT NULL,
	"creater_id" varchar(19) NOT NULL,
	"before_word" text NOT NULL,
	"after_word" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tts"."dictionary_enable" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(19) NOT NULL,
	"dictionary_id" integer NOT NULL,
	"disabled" boolean NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tts"."speaker_emotion_master" (
	"id" integer PRIMARY KEY NOT NULL,
	"speaker" varchar,
	"emotion" varchar
);
--> statement-breakpoint
CREATE TABLE "tts"."users_voice_preference" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" varchar(19) NOT NULL,
	"user_id" varchar(19) NOT NULL,
	"speaker" varchar(6) NOT NULL,
	"emotion" varchar(9) NOT NULL,
	"emotion_level" integer NOT NULL,
	"pitch" integer NOT NULL,
	"speed" integer NOT NULL,
	"is_mnuted" boolean NOT NULL,
	"is_self_edited" boolean NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tts"."voice_preference" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(19) NOT NULL,
	"speaker" varchar(6) NOT NULL,
	"emotion" varchar(9) NOT NULL,
	"emotion_level" integer NOT NULL,
	"pitch" integer NOT NULL,
	"speed" integer NOT NULL,
	"text_length" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "parent_user_idx" ON "tts"."users_voice_preference" USING btree ("parent_id","user_id");--> statement-breakpoint
CREATE INDEX "user_idx" ON "tts"."voice_preference" USING btree ("user_id");