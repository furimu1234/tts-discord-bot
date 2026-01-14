import type { Message } from 'discord.js';
import { BaseReplace } from './base';
import { DictionaryReplace, type IDictionaryResponse } from './dictionary';
import { DiscordReplace } from './discord';

export const makeReplaceClient = () => {
	const base = (value: string) => {
		const replace = BaseReplace();
		const replaced = replace.kusa(value);

		return replaced;
	};

	const discordFromMessage = async (message: Message) => {
		if (!message.guild) return message.content;

		let value = message.content;

		const replace = DiscordReplace();

		value = replace.channelMentionToName(value, message.guild);
		value = replace.roleMentionToName(value, message.guild);
		value = await replace.userMentionToName(value, message.guild);
		return value;
	};

	const dictionary = (value: string, dictionaries: IDictionaryResponse) => {
		const replace = DictionaryReplace();

		return replace.auto(value, dictionaries);
	};

	const runAllFromMessage = async (
		baseMessage: Message,
		dictionaries: IDictionaryResponse,
	) => {
		let baseText = await discordFromMessage(baseMessage);
		baseText = base(baseText);
		baseText = dictionary(baseText, dictionaries);

		return baseText;
	};

	return {
		base,
		discordFromMessage,
		dictionary,
		runAllFromMessage,
	};
};

export type IReplaceClient = ReturnType<typeof makeReplaceClient>;
