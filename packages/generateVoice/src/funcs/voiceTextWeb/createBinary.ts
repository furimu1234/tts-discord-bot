import type { defaultVoiceEmotion, defaultVoiceSpeaker } from '@tts/db';
import { VOICE_TEXT_WEB_API_BASE_URL } from '@tts/lib';

export interface voiceTextWebProp {
	text: string;
	speaker: defaultVoiceSpeaker;
	emotion: defaultVoiceEmotion;
	emotionLevel?: number;
	pitch: number;
	speed: number;
	volume?: number;
}

export const createBinary = async (
	APIKey: string,
	option: voiceTextWebProp,
): Promise<Buffer<ArrayBuffer>> => {
	let body = option;

	if (option.volume === undefined) {
		option.volume = 100;
	}

	if (option.speaker === 'show') {
		const { emotionLevel, ...bodyOption } = option;
		body = bodyOption;
	}

	const voiceRes = await fetch(`${VOICE_TEXT_WEB_API_BASE_URL}/v1/tts`, {
		headers: {
			Authorization: `Basic ${btoa(`${APIKey}:`)}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: JSON.stringify(body),
	});

	if (!voiceRes.ok) {
		const contentType = voiceRes.headers.get('content-type');
		const errorData = contentType?.includes('application/json')
			? JSON.stringify(await voiceRes.json())
			: await voiceRes.text();

		console.error(`status=${voiceRes.status} error=${errorData}`);
		throw new Error(
			`MakeVoiceTextWebBinaryException: ${voiceRes.status}, ${errorData}`,
		);
	}

	return Buffer.from(await voiceRes.arrayBuffer());
};
