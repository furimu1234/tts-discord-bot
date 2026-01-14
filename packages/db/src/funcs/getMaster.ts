import { and, eq } from 'drizzle-orm';
import type { SchemaDB } from '../client';
import type { emotion, speaker } from '../handmeid';
import { speakerEmotionMaster } from '../schema';

/**
 * マスター設定を取得する
 * @param db drizzle
 * @param speaker speaker
 * @param emotion emotion
 * @returns
 */
export const getMaster = async (
	db: SchemaDB,
	speaker?: speaker,
	emotion?: emotion,
) => {
	return await db.query.speakerEmotionMaster.findFirst({
		where: and(
			speaker !== undefined
				? eq(speakerEmotionMaster.speaker, speaker)
				: undefined,
			emotion !== undefined
				? eq(speakerEmotionMaster.emotion, emotion)
				: undefined,
		),
	});
};

/**
 * マスター設定をspeakeridから取得する
 * @param db drizzle
 * @param id speaker id
 * @returns
 */
export const getMasterBySpeakerId = async (db: SchemaDB, id: number) => {
	return await db.query.speakerEmotionMaster.findFirst({
		where: eq(speakerEmotionMaster.id, id),
	});
};
