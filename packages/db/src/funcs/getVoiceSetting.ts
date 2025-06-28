import { and, eq, inArray } from 'drizzle-orm';

import { type SchemaDB, usersVoicePreference, voicePreference } from '../';

/**
 * Voice Text Web APIの設定を取得する
 * @param db prisma
 * @param userid 設定を取得するユーザのID
 * @returns
 */
export async function getVoiceSetting(db: SchemaDB, userid: string) {
	const results = await db
		.select()
		.from(voicePreference)
		.where(eq(voicePreference.userId, userid));

	if (results.length === 0) return undefined;

	return results[0];
}

/**
 * Voice Text Web APIの設定を取得する
 * @param db prisma
 * @param userid 設定を取得するユーザのID
 * @returns
 */
export async function getVoiceSubSettings(
	db: SchemaDB,
	parentId: string,
	userIds: string[],
) {
	const results = await db
		.select()
		.from(usersVoicePreference)
		.where(
			and(
				eq(usersVoicePreference.parentId, parentId),
				inArray(usersVoicePreference.userId, userIds),
			),
		);

	return results;
}

/**
 * Voice Text Web APIの設定を取得する
 * @param db prisma
 * @param userid 設定を取得するユーザのID
 * @returns
 */
export async function getVoiceSubSetting(
	db: SchemaDB,
	parentId: string,
	userid: string,
) {
	const results = await db
		.select()
		.from(usersVoicePreference)
		.where(
			and(
				eq(usersVoicePreference.parentId, parentId),
				eq(usersVoicePreference.userId, userid),
			),
		);

	return results[0];
}
