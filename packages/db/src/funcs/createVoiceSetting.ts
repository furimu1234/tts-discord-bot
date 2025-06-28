import {
	getRandomDoubleInRange,
	type mainVoiceSettingFilter,
	usersVoicePreference,
	voicePreference,
} from '../';
import type { SchemaDB } from '../client';

import { getRandomInRange, getRandomSpeakerId } from './utils';
/**
 * voice text webapiの設定を登録する
 * @param db drizzle
 * @param userid 設定を登録するユーザのID
 * @returns
 */
export async function createVoiceSetting(db: SchemaDB, userId: string) {
	const voiceValue = createInitVoice();

	const results = await db
		.insert(voicePreference)
		.values({
			...voiceValue,
			userId: userId,
			textLength: 100,
		})
		.returning();

	if (results.length === 0) throw new Error('');

	return results[0];
}

/**
 * voice text webapiの設定を登録する
 * @param db drizzle
 * @param userid 設定を登録するユーザのID
 * @returns
 */
export async function createSubVoiceSetting(
	db: SchemaDB,
	parentUserId: string,
	userId: string,
	voiceData?: mainVoiceSettingFilter,
) {
	let values = {
		...createInitVoice(),
		userId: userId,
		parentId: parentUserId,
		isMuted: false,
		isSelfEdited: false,
	};

	//idを削除
	if (!voiceData?.speakerId) {
		const value = await createVoiceSetting(db, userId);
		const { id, ...rest } = value;

		values = {
			...rest,
			parentId: parentUserId,
			isMuted: false,
			isSelfEdited: false,
		};
	} else if (voiceData) {
		const { id, ...rest } = voiceData;

		values = {
			...values,
			...rest,
			parentId: parentUserId,
		};
	}

	const results = await db
		.insert(usersVoicePreference)
		.values(values)
		.returning();

	if (results.length === 0) throw new Error('');

	return results[0];
}

function createInitVoice() {
	/**VoiceVox */
	const voiceType = getRandomInRange(0, 1);
	let speakerId = getRandomSpeakerId();
	let emotionLevel = getRandomDoubleInRange(0.0, 2.0);
	let pitch = getRandomDoubleInRange(-0.15, 0.15);
	let speed = 1.0;

	/**標準音声 */
	if (voiceType >= 0) {
		speakerId = getRandomSpeakerId(17) + 500;
		emotionLevel = getRandomInRange(1, 4);
		pitch = getRandomInRange(50, 100);
		speed = 100;
	}

	return { speakerId, emotionLevel, pitch, speed };
}
