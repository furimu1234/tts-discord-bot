import { and, eq } from 'drizzle-orm';
import type { SchemaDB } from '../client';
import { dictionary } from '../schema';

/**
 * 辞書設定を削除する
 * @param db drizzle
 * @param guildId 辞書が設定されてるサーバーのID
 * @param beforeWord 置換前単語
 * @returns boolean
 */
export const deleteDictionary = async (
	db: SchemaDB,
	guildId: string,
	beforeWord: string,
) => {
	return await db
		.delete(dictionary)
		.where(
			and(
				eq(dictionary.createGuildId, guildId),
				eq(dictionary.beforeWord, beforeWord),
			),
		);
};
