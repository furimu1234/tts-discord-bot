import {
	type InferInsertModel,
	type InferSelectModel,
	and,
	eq,
} from 'drizzle-orm';
import { type SchemaDB, usersVoicePreference, voicePreference } from '../';
type UpdateVoice = Omit<
	InferSelectModel<typeof voicePreference>,
	'createdAt' | 'updatedAt' | 'id'
>;

type UpdateSubVoice = Omit<
	InferInsertModel<typeof usersVoicePreference>,
	'createdAt' | 'updatedAt' | 'id'
>;

/**
 * voice text webapiの設定を更新する
 * @param db drizzle
 * @param userid 設定を更新するユーザのID
 * @returns
 */
export async function updateVoiceSetting(
	db: SchemaDB,
	userId: string,
	data: UpdateVoice,
) {
	const effects = await db
		.update(voicePreference)
		.set({
			userId: userId,
			speakerId: data.speakerId,
			emotionLevel: data.emotionLevel,
			pitch: data.pitch,
			speed: data.speed,
		})
		.where(eq(voicePreference.userId, userId))
		.returning();

	if (effects.length === 0) return undefined;

	await db
		.update(usersVoicePreference)
		.set({
			speakerId: data.speakerId,
			emotionLevel: data.emotionLevel,
			pitch: data.pitch,
			speed: data.speed,
		})
		.where(
			and(
				eq(usersVoicePreference.userId, userId),
				eq(usersVoicePreference.isSelfEdited, false),
			),
		);

	return effects[0];
}

/**
 * voice text webapiの設定を更新する
 * @param db drizzle
 * @param userid 設定を更新するユーザのID
 * @returns
 */
export async function updateSubVoiceSetting(
	db: SchemaDB,
	parentUserId: string,
	userId: string,
	data: UpdateSubVoice,
) {
	const effects = await db
		.update(usersVoicePreference)
		.set({
			speakerId: data.speakerId,
			emotionLevel: data.emotionLevel,
			pitch: data.pitch,
			speed: data.speed,
			isMuted: data.isMuted,
			isSelfEdited: data.isSelfEdited,
		})
		.where(
			and(
				eq(usersVoicePreference.userId, userId),
				eq(usersVoicePreference.parentId, parentUserId),
			),
		)
		.returning();

	if (effects.length === 0) return undefined;

	return effects[0];
}
