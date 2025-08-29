import { ChannelType, type Guild, type Message } from 'discord.js';

/**discordメッセージを変換する */
interface IDiscordReplace {
	/**チャンネルメンションをチャンネル名に置換する */
	channelMentionToNameFromMessage: (message: Message) => string;
	/**ロールメンションをロール名に置換する */
	roleMentionToNameFromMessage: (message: Message) => string;
	/**ユーザメンションをユーザ名に置換する */
	userMentionToNameFromMessage: (message: Message) => Promise<string>;
	/**チャンネルメンションをチャンネル名に置換する */
	channelMentionToName: (text: string, guild: Guild) => string;
	/**ロールメンションをロール名に置換する */
	roleMentionToName: (text: string, guild: Guild) => string;
	/**ユーザメンションをユーザ名に置換する */
	userMentionToName: (text: string, guild: Guild) => Promise<string>;
}

export const DiscordReplace = (): IDiscordReplace => {
	const channelMentionToNameFromMessage = (message: Message): string => {
		if (!message.guild) return message.content;

		let text = message.content;

		const matches = [...text.matchAll(/<#(\d+)>/g)];

		for (const match of matches) {
			const channelId = match[1];
			const channel = message.guild.channels.cache
				.filter((x) => x.type === ChannelType.GuildText)
				.get(channelId);
			if (channel) {
				text = text.replace(match[0], channel.name);
			}
		}

		return text;
	};

	const channelMentionToName = (text: string, guild: Guild): string => {
		const matches = [...text.matchAll(/<#(\d+)>/g)];

		for (const match of matches) {
			const channelId = match[1];
			const channel = guild.channels.cache
				.filter((x) => x.type === ChannelType.GuildText)
				.get(channelId);
			if (channel) {
				text = text.replace(match[0], channel.name);
			}
		}

		return text;
	};

	const roleMentionToNameFromMessage = (message: Message): string => {
		if (!message.guild) return message.content;

		let text = message.content;

		const matches = [...text.matchAll(/<@&(\d+)>/g)];

		for (const match of matches) {
			const roleId = match[1];
			const role = message.guild.roles.cache.get(roleId);
			if (role) {
				text = text.replace(match[0], role.name);
			}
		}

		return text;
	};
	const roleMentionToName = (text: string, guild: Guild): string => {
		const matches = [...text.matchAll(/<@&(\d+)>/g)];

		for (const match of matches) {
			const roleId = match[1];
			const role = guild.roles.cache.get(roleId);
			if (role) {
				text = text.replace(match[0], role.name);
			}
		}

		return text;
	};

	const userMentionToNameFromMessage = async (
		message: Message,
	): Promise<string> => {
		if (!message.guild) return message.content;

		let text = message.content;

		const matches = [...text.matchAll(/<@!?(\d+)>/g)];

		if (message.guild.members.cache.size < 2) {
			await message.guild.members.fetch({});
		}

		for (const match of matches) {
			const memberId = match[1];

			const member = message.guild.members.cache.get(memberId);
			if (member) {
				text = text.replace(match[0], member.displayName);
			}
		}

		return text;
	};

	const userMentionToName = async (
		text: string,
		guild: Guild,
	): Promise<string> => {
		const matches = [...text.matchAll(/<@!?(\d+)>/g)];

		if (guild.members.cache.size < 2) {
			await guild.members.fetch({});
		}

		for (const match of matches) {
			const memberId = match[1];

			const member = guild.members.cache.get(memberId);
			if (member) {
				text = text.replace(match[0], member.displayName);
			}
		}

		return text;
	};

	return {
		channelMentionToNameFromMessage,
		roleMentionToNameFromMessage,
		userMentionToNameFromMessage,
		channelMentionToName,
		roleMentionToName,
		userMentionToName,
	};
};
