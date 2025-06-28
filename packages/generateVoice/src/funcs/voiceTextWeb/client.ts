import { Readable } from 'node:stream';
import { type AudioResource, createAudioResource } from '@discordjs/voice';
import {
	BaseReplace,
	DictionaryReplace,
	DiscordReplace,
	type IDictionaryResponse,
	type IGlobalDictionaryResponse,
} from '@tts/replace';
import type { Message } from 'discord.js';
import { createBinary, type voiceTextWebProp } from './createBinary';

export interface IVoiceTextWebClient {
	replace: (
		message: Message,
		dictionaries: IDictionaryResponse,
		globalDictionaries: IGlobalDictionaryResponse,
	) => Promise<string>;
	generateVoiceToDiscordResource: (
		options: voiceTextWebProp,
	) => Promise<AudioResource<null>>;
}

export const voiceTextWebClient = (APIKey: string): IVoiceTextWebClient => {
	const replace = async (
		message: Message,
		dictionaries: IDictionaryResponse = [],
		globalDictionaries: IGlobalDictionaryResponse = [],
	) => {
		/**ベース置換 */
		const baseReplace = BaseReplace();
		message.content = baseReplace.kusa(message.content);

		/**discord置換 */
		const discordReplace = DiscordReplace();
		message.content = discordReplace.channelMentionToNameFromMessage(message);
		message.content = discordReplace.roleMentionToNameFromMessage(message);
		message.content =
			await discordReplace.userMentionToNameFromMessage(message);

		/**辞書置換 */
		const dictionaryReplace = DictionaryReplace();
		message.content = dictionaryReplace.auto(
			message.content,
			dictionaries,
			globalDictionaries,
		);

		return message.content;
	};

	const generateVoiceToDiscordResource = async (
		options: voiceTextWebProp,
	): Promise<AudioResource<null>> => {
		const voiceBinary = await createBinary(APIKey, options);

		const stream = Readable.from(voiceBinary);

		return createAudioResource(stream, { inputType: undefined });
	};

	return {
		replace,
		generateVoiceToDiscordResource,
	};
};
