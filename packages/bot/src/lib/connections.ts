import {
	type VoiceConnection,
	VoiceConnectionStatus,
	getVoiceConnection as getRawVoiceConnection,
	joinVoiceChannel,
} from '@discordjs/voice';
import type { Client, Message } from 'discord.js';
import {
	ttsBotClient1,
	ttsBotClient2,
	ttsBotClient3,
	ttsBotClient4,
} from '../container';

export const isDisConnected = (connection?: VoiceConnection) => {
	return connection?.state.status === VoiceConnectionStatus.Disconnected;
};

/**ボイスコネクションを取得する */
export const createVoiceConnection = (
	client: Client,
	message: Message,
	voiceChannelId: string,
) => {
	if (!message.guild) return;
	if (!client.user) return;

	let connection = getRawVoiceConnection(message.guild.id, client.user.id);

	if (!connection) {
		connection = joinVoiceChannel({
			channelId: voiceChannelId,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
			group: client.user.id,
			selfDeaf: true,
		});
	}

	return connection;
};

export const getBlankVoiceConnection = (
	message: Message,
	voiceChannelId: string,
) => {
	let client: Client | undefined = ttsBotClient1;

	let connection = createVoiceConnection(
		ttsBotClient1,
		message,
		voiceChannelId,
	);
	if (!isDisConnected(connection)) {
		connection = createVoiceConnection(ttsBotClient2, message, voiceChannelId);
		client = ttsBotClient2;
	}

	if (!isDisConnected(connection)) {
		connection = createVoiceConnection(ttsBotClient3, message, voiceChannelId);
		client = ttsBotClient3;
	}

	if (!isDisConnected(connection)) {
		connection = createVoiceConnection(ttsBotClient4, message, voiceChannelId);
		client = ttsBotClient4;
	}

	return { connection, client };
};
