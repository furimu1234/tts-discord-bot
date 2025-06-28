ALTER TABLE "tts"."voice_preference" RENAME COLUMN "speaker" TO "speakerId";--> statement-breakpoint
ALTER TABLE "tts"."users_voice_preference" ALTER COLUMN "emotion_level" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "tts"."voice_preference" ALTER COLUMN "emotion_level" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "tts"."voice_preference" DROP COLUMN "emotion";