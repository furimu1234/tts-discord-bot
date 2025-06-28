import { VOICEVOX_BASE_URL } from '@tts/lib';
import {
	AudioQuerySchema,
	type BaseVoiceParam,
	type IAudioQuery,
} from './types';

export const createAudioQuery = async (
	param: BaseVoiceParam,
): Promise<IAudioQuery> => {
	const queryRes = await fetch(
		`${VOICEVOX_BASE_URL}/audio_query?text=${encodeURIComponent(param.text)}&speaker=${param.speaker}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		},
	);

	if (!queryRes.ok) {
		throw new Error('ボイスの生成に失敗しました。');
	}

	const result = AudioQuerySchema.safeParse(await queryRes.json());

	if (!result.success) {
		throw new Error('ボイスの生成に失敗しました。(パラメータ不正)');
	}

	return result.data;
};
