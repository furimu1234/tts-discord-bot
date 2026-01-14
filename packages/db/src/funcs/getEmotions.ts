import { eq } from 'drizzle-orm';
import type { SchemaDB } from '../client';
import type { speaker } from '../handmeid';
import { speakerEmotionMaster } from '../schema';

/**
 * 話者に対応した感情を取得する
 * @param db drizzle
 * @param id vvvoiceinfoのレコードID
 * @returns
 */
export const getEmotions = async (db: SchemaDB, speaker: speaker) => {
	return await db.query.speakerEmotionMaster.findMany({
		where: eq(speakerEmotionMaster.speaker, speaker),
	});
};
