import { ChannelType } from 'discord.js';

export const autoConnectVoiceType = [
	ChannelType.GuildVoice,
	ChannelType.GuildStageVoice,
];
export const autoConnectTextType = [
	...autoConnectVoiceType,
	ChannelType.GuildText,
];
