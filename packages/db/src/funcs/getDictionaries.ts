import { and, eq } from 'drizzle-orm';
import type { SchemaDB } from '../client';
import { dictionary } from '../schema';

/**
 * 辞書一覧を取得する
 * @param db drizzle
 * @param guildId guildId
 * @returns
 */
export const getDictionaries = async (db: SchemaDB, guildId: string) => {
	return await db.query.dictionary.findMany({
		where: eq(dictionary.createGuildId, guildId),
	});
};

/**
 * 辞書を取得する
 *
 */
export const getDictionary = async (
	db: SchemaDB,
	guildId: string,
	beforeWord: string,
) => {
	return await db.query.dictionary.findFirst({
		where: and(
			eq(dictionary.createGuildId, guildId),
			eq(dictionary.beforeWord, beforeWord),
		),
	});
};
