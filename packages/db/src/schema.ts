import { relations } from 'drizzle-orm';
import {
	boolean,
	doublePrecision,
	index,
	integer,
	pgSchema,
	serial,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import type { emotion, speaker } from './handmeid';

const dbSchema = pgSchema('tts');

export const spakerEmotionMaster = dbSchema.table('speaker_emotion_master', {
	id: integer('id').primaryKey(),
	spekaer: varchar('speaker').$type<speaker>(),
	emotion: varchar('emotion').$type<emotion>(),
});

export const guildInfo = dbSchema.table('guild_info', {
	id: serial('id').primaryKey(),
	guildId: varchar('guild_id', { length: 19 }).notNull(),
	textLength: integer('text_length').default(50).notNull(),
});

export const voicePreference = dbSchema.table(
	'voice_preference',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id', { length: 19 }).notNull(),
		speakerId: integer().notNull(),
		emotionLevel: doublePrecision('emotion_level').notNull(),
		pitch: doublePrecision('pitch').notNull(),
		speed: doublePrecision('speed').notNull(),
		textLength: integer('text_length').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index('user_idx').on(table.userId)],
);

export const usersVoicePreference = dbSchema.table(
	'users_voice_preference',
	{
		id: serial('id').primaryKey(),
		parentId: varchar('parent_id', { length: 19 }).notNull(),
		userId: varchar('user_id', { length: 19 }).notNull(),
		speakerId: integer().notNull(),
		emotionLevel: doublePrecision('emotion_level').notNull(),
		pitch: doublePrecision('pitch').notNull(),
		speed: doublePrecision('speed').notNull(),
		isMuted: boolean('is_mnuted').notNull(),
		isSelfEdited: boolean('is_self_edited').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index('parent_user_idx').on(table.parentId, table.userId)],
);

export const dictionary = dbSchema.table('dictionary', {
	id: serial('id').primaryKey(),
	parentId: varchar('parent_id', { length: 19 }).notNull(),
	createrId: varchar('creater_id', { length: 19 }).notNull(),
	beforeWord: text('before_word').notNull(),
	afterWord: text('after_word').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const dictionaryEnable = dbSchema.table('dictionary_enable', {
	id: serial('id').primaryKey(),
	userId: varchar('user_id', { length: 19 }).notNull(),
	dictionaryId: integer('dictionary_id').notNull(),
	disabled: boolean().notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const creatorRelations = relations(voicePreference, ({ many }) => ({
	usersVoicePreference: many(usersVoicePreference),
}));
export const usersRelations = relations(usersVoicePreference, ({ one }) => ({
	parentId: one(voicePreference, {
		fields: [usersVoicePreference.parentId],
		references: [voicePreference.userId],
	}),
}));
