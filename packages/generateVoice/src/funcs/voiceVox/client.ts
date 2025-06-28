import { Readable } from 'node:stream';
import { type AudioResource, createAudioResource } from '@discordjs/voice';
import { createAudioQuery } from './createAudioQuery';
import { Synthesis } from './synthesis';
import type { BaseVoiceParam } from './types';

type generateVoiceProps = BaseVoiceParam;

export interface IVoiceVoxClient {
	generateVoiceToDiscordResource: (
		options: generateVoiceProps,
	) => Promise<AudioResource<null>>;
}

export const VoiceVoxClient = (): IVoiceVoxClient => {
	const generateVoiceToDiscordResource = async (
		options: generateVoiceProps,
	): Promise<AudioResource<null>> => {
		const query = await createAudioQuery(options);

		const voiceBynarry = await Synthesis(options, query);
		const stream = Readable.from(voiceBynarry);

		return createAudioResource(stream, { inputType: undefined });
	};

	return {
		generateVoiceToDiscordResource,
	};
};
