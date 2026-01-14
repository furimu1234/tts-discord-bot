import { SendError } from '@tts/lib';
import { eq } from 'drizzle-orm';
import { fa } from 'zod/v4/locales';
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
			.returning({ id: vtVoiceInfo.id });

		if (vtModels.length !== 1)
			throw new SendError(
				'Voice Text Web APIのデータ登録に失敗しました。',
				false,
			);

		//voiceinfoが無ければ新規登録
		//既にあればvvvoiceinfoかvtvoiceifnoのレコードIDを更新する
		const alreadyModel = await db.query.voiceInfo.findFirst({
			where: eq(voiceInfo.userId, userId),
		});

		if (!alreadyModel) {
			await db.insert(voiceInfo).values([
				{
					userId: userId,
					useVv: false,
					vtId: vtModels[0].id,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]);
		} else {
			await db
				.update(voiceInfo)
				.set({ vtId: vtModels[0].id, updatedAt: new Date() })
				.where(eq(voiceInfo.userId, userId));
		}
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
			.returning({ id: vvVoiceInfo.id });

		if (vvModels.length !== 1)
			throw new SendError('VOICE VOXのデータ登録に失敗しました', false);

		const alreadyModel = await db.query.voiceInfo.findFirst({
			where: eq(voiceInfo.userId, userId),
		});

		if (!alreadyModel) {
			await db.insert(voiceInfo).values([
				{
					userId: userId,
					useVv: false,
					vtId: vvModels[0].id,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]);
		} else {
			await db
				.update(voiceInfo)
				.set({ vvId: vvModels[0].id, updatedAt: new Date() })
				.where(eq(voiceInfo.userId, userId));
		}
	}
};
