import {
	type VoiceConnection,
	VoiceConnectionStatus,
	getVoiceConnection as getRawVoiceConnection,
	joinVoiceChannel,
} from '@discordjs/voice';
import type { Client, Message } from 'discord.js';
import { botClient } from '../container';

export const isDisConnected = (connection?: VoiceConnection) => {
	return connection?.state.status === VoiceConnectionStatus.Disconnected;
};

/**ボイスコネクションを取得する */
export const createVoiceConnection = async (
	client: Client,
	message: Message,
	voiceChannelId: string,
	isDisConnect = false,
) => {
	if (!message.guild) return;
	if (!client.user) return;

	let connection = getRawVoiceConnection(message.guild.id, client.user.id);

	if (!connection) {
		//意味があるかわからないけどVCに残ってた場合を考慮し強制切断
		try {
			if (isDisConnect) await message.guild.members.me?.voice.disconnect();
		} catch {}
		//再接続

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
	const client: Client | undefined = botClient;

	const connection = createVoiceConnection(botClient, message, voiceChannelId);

	return { connection, client };
};
