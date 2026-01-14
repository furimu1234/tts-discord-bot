import {
	getVoiceConnection as getRawVoiceConnection,
	joinVoiceChannel,
	type VoiceConnection,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import type { Client, Guild } from 'discord.js';

export const isDisConnected = (connection?: VoiceConnection) => {
	return connection?.state.status === VoiceConnectionStatus.Disconnected;
};

/**ボイスコネクションを取得する */
export const createVoiceConnection = async (
	client: Client,
	guild: Guild,
	voiceChannelId: string,
	isDisConnect = true,
) => {
	if (!client.user) return;

	let connection = getRawVoiceConnection(guild.id, client.user.id);

	if (!connection) {
		//意味があるかわからないけどVCに残ってた場合を考慮し強制切断
		try {
			if (isDisConnect) await guild.members.me?.voice.disconnect();
		} catch {}
		//再接続

		connection = joinVoiceChannel({
			channelId: voiceChannelId,
			guildId: guild.id,
			adapterCreator: guild.voiceAdapterCreator,
			group: client.user.id,
			selfDeaf: true,
		});
	}

	return connection;
};
