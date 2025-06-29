import { getVoiceConnection } from '@discordjs/voice';
import { type Client, Events, type Message } from 'discord.js';
import {
	container,
	ttsBotClient1,
	ttsBotClient2,
	ttsBotClient3,
	ttsBotClient4,
} from '../../container';
import { FailedDisconnect } from '../../errors';
import { fetchMember, sendErrorMessage } from '../../lib';

export const name = Events.MessageCreate;
export const once = false;

/**
 * コマンドを入力した人が入ってるVCから切断する
 */
export async function execute(message: Message): Promise<void> {
	if (!container.current) return;

	const guild = message.guild;

	if (!guild) return;

	if (!message.channel.isSendable()) return;

	if (message.content !== '読み上げ終了') return;

	const member = await fetchMember(guild, {
		memberId: message.author.id,
	});

	if (!member) return;

	const voiceChannel = member.voice.channel;

	if (!voiceChannel) {
		sendErrorMessage(message.channel, 'VCに接続してから実行してね!');
		return;
	}

	const voiceChannelMemberIds = voiceChannel.members.map((x) => x.id);

	let botClient: Client | undefined = undefined;

	const botUser1 = ttsBotClient1.user;
	const botUser2 = ttsBotClient2.user;
	const botUser3 = ttsBotClient3.user;
	const botUser4 = ttsBotClient4.user;

	//コマンドを入力した人が入ってるVCに居るBOTを切断する

	if (botUser1 !== null) {
		if (voiceChannelMemberIds.find((x) => x === botUser1.id)) {
			botClient = ttsBotClient1;
		}
	} else if (botUser2 !== null) {
		if (voiceChannelMemberIds.find((x) => x === botUser2.id)) {
			botClient = ttsBotClient2;
		}
	} else if (botUser3 !== null) {
		if (voiceChannelMemberIds.find((x) => x === botUser3.id)) {
			botClient = ttsBotClient3;
		}
	} else if (botUser4 !== null) {
		if (voiceChannelMemberIds.find((x) => x === botUser4.id)) {
			botClient = ttsBotClient4;
		}
	} else {
		throw new FailedDisconnect(message.channel);
	}

	if (!botClient?.user) {
		throw new FailedDisconnect(message.channel);
	}

	const connection = getVoiceConnection(guild.id, botClient.user.id);

	if (!connection) {
		throw new FailedDisconnect(message.channel);
	}

	connection.destroy();

	message.react('✅');
}
