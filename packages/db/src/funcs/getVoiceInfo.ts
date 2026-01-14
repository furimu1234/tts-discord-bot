import { SendError } from '@tts/lib';
import { eq } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import type z from 'zod';
import type { SchemaDB } from '../client';
import type { emotion, speaker } from '../handmeid';
import {
	speakerEmotionMaster,
	voiceInfo,
	vtVoiceInfo,
	vvVoiceInfo,
} from '../schema';

export const voiceInfoSchema = createSelectSchema(voiceInfo);
export const vvVoiceInfoSchema = createSelectSchema(vvVoiceInfo);
export const vtVoiceInfoSchema = createSelectSchema(vtVoiceInfo);
export const masterSchema = createSelectSchema(speakerEmotionMaster);

export type VoiceInfo = z.infer<typeof voiceInfoSchema>;
export type VvVoiceInfo = z.infer<typeof vvVoiceInfoSchema>;
export type VtVoiceInfo = z.infer<typeof vtVoiceInfoSchema>;
export type SpeakerEmotionMaster = {
	id: number;
	speaker: speaker;
	emotion: emotion;
};

export type GetVoiceInfo = {
	main: VoiceInfo;
	sub?: VvVoiceInfo | VtVoiceInfo;
	master?: SpeakerEmotionMaster;
};

/**
 * 読み上げ音声設定を取得
 * @param db
 * @param userId
 * @returns
 */
export const getVoiceInfo = async (
	db: SchemaDB,
	userId: string,
): Promise<GetVoiceInfo | undefined> => {
	const model = await db.query.voiceInfo.findFirst({
		where: eq(voiceInfo.userId, userId),
	});

	if (!model) return;

	if (model.useVv && model.vvId) {
		const sub = await db.query.vvVoiceInfo.findFirst({
			where: eq(vvVoiceInfo.id, model.vvId),
		});

		if (!sub) return { main: model };

		const master = await db.query.speakerEmotionMaster.findFirst({
			where: eq(speakerEmotionMaster.id, sub.speakerId),
		});

		if (!master) return { main: model };

		return {
			main: model,
			sub,
			master,
		};
	}
	if (!model.useVv && model.vtId) {
		const sub = await db.query.vtVoiceInfo.findFirst({
			where: eq(vtVoiceInfo.id, model.vtId),
		});
		if (!sub) return { main: model };

		const master = await db.query.speakerEmotionMaster.findFirst({
			where: eq(speakerEmotionMaster.id, sub.speakerId),
		});

		if (!master) return { main: model };

		return {
			main: model,
			sub,
			master,
		};
	}
	throw new Error(
		'model.useVv && model.vvIdもしくは!model.useVv && model.vtidを満たしません',
	);
};

/**
 * Voice Voxの設定を取得する
 * @param db drizzle
 * @param id vvvoiceinfoのレコードID
 * @returns
 */
export const getVvVoiceInfo = async (db: SchemaDB, id: number) => {
	return await db.query.vvVoiceInfo.findFirst({
		where: eq(vvVoiceInfo.id, id),
	});
};

/**
 * Voice Textの設定を取得する
 * @param db drizzle
 * @param id vtvoiceinfoのレコードID
 * @returns
 */
export const getVtVoiceInfo = async (db: SchemaDB, id: number) => {
	return await db.query.vtVoiceInfo.findFirst({
		where: eq(vtVoiceInfo.id, id),
	});
};
