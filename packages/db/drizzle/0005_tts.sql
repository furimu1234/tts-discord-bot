CREATE TABLE "tts"."guild_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(19) NOT NULL,
	"text_length" integer DEFAULT 50 NOT NULL
);
