import { messageID, SendError } from '@tts/lib';
import { eq } from 'drizzle-orm';

import type { SchemaDB } from '../client';
import { voiceInfo } from '../schema';

/**
 * Voice Infoデータ登録
 * @param db drizzle
 * @param userId discord user id
 * @param model db model
 */
export const updateMainVoiceInfo = async (
	db: SchemaDB,
	userId: string,
	model: typeof voiceInfo.$inferSelect,
) => {
	const newModel = await db
		.update(voiceInfo)
		.set(model)
		.where(eq(voiceInfo.userId, userId))
		.returning();

	if (newModel.length !== 1) {
		throw new SendError(messageID.E00001(), false);
	}

	return true;
};
