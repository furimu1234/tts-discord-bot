import { VOICEVOX_BASE_URL } from '@tts/lib';
import type { BaseVoiceParam, IAudioQuery } from './types';

export const Synthesis = async (
	params: BaseVoiceParam,
	query: IAudioQuery,
): Promise<Buffer<ArrayBuffer>> => {
	const synthRes = await fetch(
		`${VOICEVOX_BASE_URL}/synthesis?spekaer=${params.speaker}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(query),
		},
	);

	if (!synthRes.ok) {
		throw new Error('音声合成に失敗しました');
	}

	return Buffer.from(await synthRes.arrayBuffer());
};
