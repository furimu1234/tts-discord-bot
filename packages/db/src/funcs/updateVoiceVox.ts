import { messageID, SendError } from '@tts/lib';
import { eq } from 'drizzle-orm';

import type { SchemaDB } from '../client';
import { vvVoiceInfo } from '../schema';

export type UpdateVoiceVoxModel = Partial<typeof vvVoiceInfo.$inferSelect>;

/**
 * Voice Infoデータ登録
 * @param db drizzle
 * @param userId discord user id
 * @param model db model
 */
export const updateVoiceVox = async (
	db: SchemaDB,
	userId: string,
	model: Partial<typeof vvVoiceInfo.$inferSelect>,
) => {
	const newModel = await db
		.update(vvVoiceInfo)
		.set(model)
		.where(eq(vvVoiceInfo.userId, userId))
		.returning();

	if (newModel.length !== 1) {
		throw new SendError(messageID.E00001(), false);
	}

	return true;
};
