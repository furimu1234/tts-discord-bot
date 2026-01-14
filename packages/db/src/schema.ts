import { relations } from 'drizzle-orm';
import {
	boolean,
	doublePrecision,
	index,
	integer,
	pgSchema,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import type { emotion, speaker } from './handmeid';

//読み上げ感情マスタ
//voice vox用
export const speakerEmotionMaster = pgTable('speaker_emotion_master', {
	id: integer('id').primaryKey(),
	speaker: varchar('speaker').$type<speaker>().notNull(),
	emotion: varchar('emotion').$type<emotion>().notNull(),
});

//サーバー設定
export const guildInfo = pgTable('guild_info', {
	id: serial('id').primaryKey(),
	guildId: varchar('guild_id', { length: 19 }).notNull(),
	//読み上げ最大文字数
	textLength: integer('text_length').default(50).notNull(),
	//自動接続・再接続有効
	isAutoConnect: boolean().default(true).notNull(),
});

//読み上げ接続設定
export const voiceConnection = pgTable(
	'voice_connection',
	{
		id: serial('id').primaryKey(),
		guildId: varchar('guild_id', { length: 19 }).notNull(),
		textId: varchar('text_id', { length: 19 }).notNull(),
		voiceId: varchar('voice_id', { length: 19 }).notNull(),
	},
	(table) => [
		index('voice_connection_voice_idx').on(table.voiceId),
		index('voice_connection_text_idx').on(table.textId),
	],
);

export const autoConnect = pgTable(
	'auto_connect',
	{
		id: serial('id').primaryKey(),
		guildId: varchar('guild_id', { length: 19 }).notNull(),
		textId: varchar('text_id', { length: 19 }).notNull(),
		voiceId: varchar('voice_id', { length: 19 }).notNull(),
	},
	(table) => [
		index('auto_connect_voice_idx').on(table.voiceId),
		index('auto_connect_text_idx').on(table.textId),
	],
);

//voice vox読み上げ設定
export const vvVoiceInfo = pgTable(
	'vv_voice_info',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id', { length: 19 }).notNull().unique(),
		// 話者+感情
		speakerId: integer().notNull(),
		//voicevox only
		intnation: doublePrecision().default(1).notNull(),
		pitch: doublePrecision('pitch').notNull(),
		speed: doublePrecision('speed').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index('vv_user_idx').on(table.userId)],
);

//VoiceText Web API読み上げ設定
export const vtVoiceInfo = pgTable(
	'vt_voice_info',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id', { length: 19 }).notNull().unique(),
		// 話者+感情
		speakerId: integer().notNull(),
		emotionLevel: integer('emotion_level').notNull(),
		pitch: integer('pitch').notNull(),
		speed: integer('speed').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index('vt_user_idx').on(table.userId)],
);

//読み上げ設定

export const voiceInfo = pgTable(
	'voice_info',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id', { length: 19 }).notNull().unique(),
		//voice voxの設定かvoice text web apiの設定か
		useVv: boolean('use_vv').notNull(),
		//voice voxのレコードID
		vvId: integer('vv_id'),
		//voice textのレコードIOD
		vtId: integer('vt_id'),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index('voice_main_user_idx').on(table.userId)],
);

//辞書
export const dictionary = pgTable(
	'dictionary',
	{
		id: serial('id').primaryKey(),
		createGuildId: varchar('create_guild_id', { length: 19 }).notNull(),
		beforeWord: text('before_word').notNull(),
		afterWord: text('after_word').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index('dictionary_before_word_idx').on(table.beforeWord)],
);

//読み上げ設定の紐づけ
export const creatorRelations = relations(voiceInfo, ({ one }) => ({
	vv: one(vvVoiceInfo),
	vt: one(vtVoiceInfo),
}));

export const vvVoiceInfoRelation = relations(vvVoiceInfo, ({ one }) => ({
	voiceInfo: one(voiceInfo, {
		fields: [vvVoiceInfo.id],
		references: [voiceInfo.vvId],
	}),
	master: one(speakerEmotionMaster, {
		fields: [vvVoiceInfo.speakerId],
		references: [speakerEmotionMaster.id],
	}),
}));
export const vtVoiceInfoRelation = relations(vtVoiceInfo, ({ one }) => ({
	voiceInfo: one(voiceInfo, {
		fields: [vtVoiceInfo.id],
		references: [voiceInfo.vtId],
	}),
	master: one(speakerEmotionMaster, {
		fields: [vtVoiceInfo.speakerId],
		references: [speakerEmotionMaster.id],
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
