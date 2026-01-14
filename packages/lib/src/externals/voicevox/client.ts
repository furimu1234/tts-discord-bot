import { Readable } from 'node:stream';
import type { ReadableStream as NodeWebReadableStream } from 'node:stream/web';
import { SendError } from '../../errors';
import { messageID } from '../../messages';
import { type AudioQuery, audioQuerySchema } from './schema';

export const makeVoiceVoxClient = () => {
	const baseUrl = process.env.VOICEVOX_URI || 'http://localhost:50021';

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
			console.error(parsed.error, 'audio query response Error');

			throw new SendError(messageID.E00001(), false);
		}

		return parsed.data;
	};

	const synthesisToStream = async (speakerId: number, query: AudioQuery) => {
		const res = await fetch(`${baseUrl}/synthesis?speaker=${speakerId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(query),
		});
		if (!res.ok || !res.body) throw new SendError(messageID.E00001(), false);

		return Readable.fromWeb(
			res.body as unknown as NodeWebReadableStream<Uint8Array>,
		);
	};

	return {
		createAudioQuery,
		synthesisToStream,
	};
};

export type IVoiceVoxClient = ReturnType<typeof makeVoiceVoxClient>;
