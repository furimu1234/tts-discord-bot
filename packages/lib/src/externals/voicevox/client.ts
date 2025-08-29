import { Readable } from 'node:stream';
import type { ReadableStream as NodeWebReadableStream } from 'node:stream/web';
import { ResponseError } from '@/errors';
import type { Logger } from 'pino';
import { type AudioQuery, audioQuerySchema } from './schema';

export const makeVoiceVoxClient = (logger: Logger) => {
	const baseUrl = 'http://tts_bot_local_voicevox_engine:50021';

	const createAudioQuery = async (speakerId: number, text: string) => {
		const response = await fetch(
			`${baseUrl}/audio_query?text=${text}&speaker=${speakerId}`,
			{
				method: 'POST',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json',
				},
			},
		);

		const result = await response.json();

		const parsed = audioQuerySchema.safeParse(result);

		if (!parsed.success) {
			logger.error(parsed.error.errors, 'audio query response Error');

			throw new ResponseError();
		}

		return parsed.data;
	};

	const synthesisToStream = async (speakerId: number, query: AudioQuery) => {
		const res = await fetch(`${baseUrl}/synthesis?speaker=${speakerId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(query),
		});
		if (!res.ok || !res.body) throw new ResponseError();

		const contentType = res.headers.get('content-type');
		const contentLength = res.headers.get('content-length');
		logger.info({ contentType, contentLength }, 'synthesis headers');

		return Readable.fromWeb(
			res.body as unknown as NodeWebReadableStream<Uint8Array>,
		);
	};

	return {
		createAudioQuery,
		synthesisToStream,
	};
};
