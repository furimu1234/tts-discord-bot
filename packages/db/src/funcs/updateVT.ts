import { messageID, SendError } from '@tts/lib';
import { eq } from 'drizzle-orm';

import type { SchemaDB } from '../client';
import { vtVoiceInfo } from '../schema';

export type UpdateVTModel = Partial<typeof vtVoiceInfo.$inferSelect>;

/**
 * VoiceText Web APIデータ更新
 * @param db drizzle
 * @param userId discord user id
 * @param model db model
 */
export const updateVT = async (
	db: SchemaDB,
	userId: string,
	model: Partial<typeof vtVoiceInfo.$inferSelect>,
) => {
	const newModel = await db
		.update(vtVoiceInfo)
		.set(model)
		.where(eq(vtVoiceInfo.userId, userId))
		.returning();

	if (newModel.length !== 1) {
		throw new SendError(messageID.E00001(), false);
	}

	return true;
};
