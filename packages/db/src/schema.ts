import { integer, pgSchema, varchar } from "drizzle-orm/pg-core";
import type { emotion, speaker } from "./handmeid";

const dbSchema = pgSchema("tts");

const spakerEmotionMaster = dbSchema.table("speaker_emotion_master", {
	id: integer("id").primaryKey(),
	spekaer: varchar("speaker").$type<speaker>(),
	emotion: varchar("emotion").$type<emotion>(),
});
