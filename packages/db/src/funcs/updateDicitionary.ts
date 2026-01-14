import { messageID, SendError } from '@tts/lib';
import { and, eq } from 'drizzle-orm';

import type { SchemaDB } from '../client';
import { autoConnect, dictionary } from '../schema';

/**
 * 自動接続の読み上げ対象のTCを更新する
 * @param db drizzle
 * @param userId discord user id
 * @param model db model
 */
export const updateDictionary = async (
	db: SchemaDB,
	guildId: string,
	beforeWord: string,
	afterWord: string,
) => {
	const newModel = await db
		.update(dictionary)
		.set({ afterWord })
		.where(
			and(
				eq(dictionary.createGuildId, guildId),
				eq(dictionary.beforeWord, beforeWord),
			),
		)
		.returning({ id: autoConnect.id });

	if (newModel.length !== 1) {
		throw new SendError(messageID.E00001(), false);
	}

	return true;
};
