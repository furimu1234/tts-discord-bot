import { messageID, SendError } from '@tts/lib';
import type { SchemaDB } from '../client';
import type { emotion, speaker } from '../handmeid';
import { autoConnect, dictionary, speakerEmotionMaster } from '../schema';

export interface MasterType {
	id: number;
	name: string;
	style: string;
}

/**
 * マスタを登録する
 * @param db drizzle
 * @paramm values
 */
export const createSpeakerEmotionMaster = async (
	db: SchemaDB,
	values: MasterType[],
) => {
	await db
		.insert(speakerEmotionMaster)
		.values(
			values.map((value) => {
				return {
					id: value.id,
					speaker: value.name as speaker,
					emotion: value.style as emotion,
				};
			}),
		)
		.onConflictDoNothing({ target: speakerEmotionMaster.id });
	return true;
};
