CREATE TABLE "auto_connect" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(19) NOT NULL,
	"text_id" varchar(19) NOT NULL,
	"voice_id" varchar(19) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "auto_connect_voice_idx" ON "auto_connect" USING btree ("voice_id");--> statement-breakpoint
CREATE INDEX "auto_connect_text_idx" ON "auto_connect" USING btree ("text_id");