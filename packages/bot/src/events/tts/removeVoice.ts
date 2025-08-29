import { getVoiceConnection } from '@discordjs/voice';
import { deleteVoiceConnection } from '@tts/db';
import { Events, type Message } from 'discord.js';
import { botClient, container } from '../../container';
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

	const store = container.current.getDataStore();

	if (!member) return;

	const voiceChannel = member.voice.channel;

	if (!voiceChannel) {
		sendErrorMessage(message.channel, 'VCに接続してから実行してね!');
		return;
	}

	if (!botClient?.user) {
		throw new FailedDisconnect(message.channel);
	}

	const connection = getVoiceConnection(guild.id, botClient.user.id);

	if (!connection) {
		throw new FailedDisconnect(message.channel);
	}

	await store.do(async (db) => {
		await deleteVoiceConnection(db, { voiceId: voiceChannel.id });
	});

	connection.destroy();

	message.react('✅');
}
