import { relations } from 'drizzle-orm';
import {
	boolean,
	doublePrecision,
	index,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import type { emotion, speaker } from './handmeid';

export const spakerEmotionMaster = pgTable('speaker_emotion_master', {
	id: integer('id').primaryKey(),
	spekaer: varchar('speaker').$type<speaker>(),
	emotion: varchar('emotion').$type<emotion>(),
});

export const guildInfo = pgTable('guild_info', {
	id: serial('id').primaryKey(),
	guildId: varchar('guild_id', { length: 19 }).notNull(),
	textLength: integer('text_length').default(50).notNull(),
	inVoiceOnly: boolean('in_voice_only').default(true).notNull(),
});

export const voiceConnection = pgTable('voice_connection', {
	id: serial('id').primaryKey(),
	guildId: varchar('guild_id', { length: 19 }).notNull(),
	textId: varchar('text_id', { length: 19 }).notNull(),
	voiceId: varchar('voice_id', { length: 19 }).notNull(),
	isAutoConnect: boolean().default(false).notNull(),
});

export const voicePreference = pgTable(
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

export const usersVoicePreference = pgTable(
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

export const dictionary = pgTable('dictionary', {
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

export const dictionaryEnable = pgTable('dictionary_enable', {
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
	voiceInfos: one(voicePreference, {
		fields: [usersVoicePreference.parentId],
		references: [voicePreference.userId],
	}),
}));

export const guildInfoRelations = relations(guildInfo, ({ many }) => ({
	voiceConnections: many(voiceConnection),
}));
export const tetVoiceGuildRelation = relations(voiceConnection, ({ one }) => ({
	guild: one(guildInfo, {
		fields: [voiceConnection.guildId],
		references: [guildInfo.guildId],
	}),
}));
