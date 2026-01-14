import { messageID, SendError } from '@tts/lib';
import type { SchemaDB } from '../client';
import { autoConnect, dictionary } from '../schema';

/**
 * 辞書を登録する
 * @param db drizzle
 * @param guildId 辞書を登録するサーバーのID
 * @param beforeWord 置換前単語
 * @param afterWord 置換後単語
 */
export const createDictionary = async (
	db: SchemaDB,
	guildId: string,
	beforeWord: string,
	afterWord: string,
) => {
	const models = await db
		.insert(dictionary)
		.values({ createGuildId: guildId, beforeWord, afterWord })
		.returning({ id: autoConnect.id });

	if (models.length !== 1) throw new SendError(messageID.E00001(), false);

	return models[0].id;
};
