ALTER TABLE "tts"."users_voice_preference" RENAME COLUMN "speaker" TO "speakerId";--> statement-breakpoint
ALTER TABLE "tts"."users_voice_preference" DROP COLUMN "emotion";