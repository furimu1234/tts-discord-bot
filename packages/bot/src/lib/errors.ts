import { EmbedBuilder, type SendableChannels } from 'discord.js';
import { sendDeleteAfterMessage } from './delete';

export const sendErrorMessage = async (
	channel: SendableChannels,
	description: string,
) => {
	const e = new EmbedBuilder({
		description,
	});

	sendDeleteAfterMessage({ embeds: [e], sleepSecond: 15 }, undefined, channel);
};
