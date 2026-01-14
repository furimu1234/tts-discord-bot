import { Readable } from 'node:stream';
import { SendError } from '../../errors';
import { messageID } from '../../messages';
import type { VoiceText } from './schema';

// もし zod を使うなら：
// import { z } from 'zod';

type VoiceTextAudioResponse = {
	audio: Readable;
	contentType: string;
	// 必要なら拡張子推定なども返せます
	format: 'wav' | 'ogg' | 'mp3';
};

export const makeVoiceTextWebClient = (apiKey: string) => {
	const baseUrl = 'https://api.voicetext.jp';
	const endpoint = `${baseUrl}/v1/tts`;

	const request = async (body: VoiceText): Promise<VoiceTextAudioResponse> => {
		// VoiceText Web API は JSON ではなく form-urlencoded が基本
		const params = new URLSearchParams();
		for (const [k, v] of Object.entries(body)) {
			if (body.speaker === 'show') {
				if (['emotion', 'emotionLevel'].includes(k)) continue;
			}

			if (v === undefined || v === null) continue;
			params.set(k, String(v));
		}

		const auth = Buffer.from(`${apiKey}:`).toString('base64');

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${auth}`,
				// 成功時は音声バイナリが返る
				Accept: 'audio/wave, audio/wav, audio/mpeg, audio/ogg, */*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: params.toString(),
		});

		if (!response.ok) {
			// エラー時は JSON: {"error":{"message":"..."}} が返る
			// ここだけ JSON を読みに行く
			let errMsg = `VoiceText API error: ${response.status}`;
			try {
				const errJson = (await response.json()) as {
					error?: { message?: string };
				};
				if (errJson?.error?.message) errMsg = errJson.error.message;
			} catch {
				// JSON でなければ握りつぶしてステータスで扱う
			}

			console.error(errMsg);
			throw new SendError(
				`${messageID.E00010()}\n${JSON.stringify(params)}`,
				false,
			);
		}

		// 成功時は音声バイナリ（wav/ogg/mp3）
		const ab = await response.arrayBuffer();
		const audio = Buffer.from(ab);

		const contentType =
			response.headers.get('content-type') ?? 'application/octet-stream';
		const format = (body.format ?? 'wav') as 'wav' | 'ogg' | 'mp3';

		return { audio: Readable.from(audio), contentType, format };
	};

	return { request };
};

export type IVOICETEXTWebClient = ReturnType<typeof makeVoiceTextWebClient>;
