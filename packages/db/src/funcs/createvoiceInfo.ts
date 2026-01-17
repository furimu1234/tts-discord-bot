import { SendError } from '@tts/lib';

import type { SchemaDB } from '../client';
import { voiceInfo, vtVoiceInfo, vvVoiceInfo } from '../schema';

export interface InitVoiceInfoData {
	speakerId: number;
	emotionLevel: number;
	pitch: number;
	speed: number;
}

/**
 * Voice Infoデータ登録
 * @param db drizzle
 * @param userId discord user id
 * @param speakerId 話者ID
 * @param emotionLevel 感情・イントネーションレベル
 * @param pitch 音程
 * @param speed 速度
 */
export const createVoiceInfo = async (
	db: SchemaDB,
	userId: string,
	{ speakerId, emotionLevel, pitch, speed }: InitVoiceInfoData,
) => {
	if (speakerId >= 500) {
		const vtModels = await db
			.insert(vtVoiceInfo)
			.values([
				{
					userId: userId,
					createdAt: new Date(),
					updatedAt: new Date(),
					speakerId: speakerId,
					emotionLevel: emotionLevel,
					pitch: pitch,
					speed: speed,
				},
			])
			.onConflictDoUpdate({
				target: vtVoiceInfo.userId,
				set: {
					emotionLevel: emotionLevel,
					pitch: pitch,
					speakerId: speakerId,
					speed: speed,
					updatedAt: new Date(),
				},
			})
			.returning({ id: vtVoiceInfo.id });

		if (vtModels.length !== 1)
			throw new SendError(
				'Voice Text Web APIのデータ登録に失敗しました。',
				false,
			);

		//voiceinfoが無ければ新規登録
		//既にあればvvvoiceinfoかvtvoiceifnoのレコードIDを更新する

		await db
			.insert(voiceInfo)
			.values([
				{
					userId: userId,
					useVv: false,
					vtId: vtModels[0].id,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			])
			.onConflictDoUpdate({
				target: voiceInfo.userId,
				set: { useVv: false, vtId: vtModels[0].id, updatedAt: new Date() },
			});
	} else {
		const vvModels = await db
			.insert(vvVoiceInfo)
			.values([
				{
					userId: userId,
					createdAt: new Date(),
					updatedAt: new Date(),
					speakerId: speakerId,
					intnation: emotionLevel,
					pitch: pitch,
					speed: speed,
				},
			])
			.onConflictDoUpdate({
				target: vvVoiceInfo.userId,
				set: {
					intnation: emotionLevel,
					speakerId: speakerId,
					pitch: pitch,
					speed: speed,
					updatedAt: new Date(),
				},
			})
			.returning({ id: vvVoiceInfo.id });

		if (vvModels.length !== 1)
			throw new SendError('VOICE VOXのデータ登録に失敗しました', false);

		await db
			.insert(voiceInfo)
			.values([
				{
					userId: userId,
					useVv: true,
					vvId: vvModels[0].id,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			])
			.onConflictDoUpdate({
				target: voiceInfo.userId,
				set: {
					useVv: true,
					vvId: vvModels[0].id,
					updatedAt: new Date(),
				},
			});
	}
};
