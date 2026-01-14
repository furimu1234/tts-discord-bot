import { messageID, SendError } from '@tts/lib';
import { eq } from 'drizzle-orm';

import type { SchemaDB } from '../client';
import { autoConnect } from '../schema';

/**
 * 自動接続の読み上げ対象のTCを更新する
 * @param db drizzle
 * @param userId discord user id
 * @param model db model
 */
export const updateAutoConnect = async (
	db: SchemaDB,
	voiceId: string,
	textId: string,
) => {
	const newModel = await db
		.update(autoConnect)
		.set({ textId: textId })
		.where(eq(autoConnect.voiceId, voiceId))
		.returning({ id: autoConnect.id });

	if (newModel.length !== 1) {
		throw new SendError(messageID.E00001(), false);
	}

	return true;
};
