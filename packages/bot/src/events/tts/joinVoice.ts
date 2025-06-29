import { createGuildInfo, getGuildInfo } from '@tts/db';
import { Events, type Message, MessageFlags } from 'discord.js';
import { createjoinVoicePanelComponent } from '../../components';
import { container } from '../../container';
import {
	fetchMember,
	getBlankVoiceConnection,
	sendErrorMessage,
} from '../../lib';

export const name = Events.MessageCreate;
export const once = false;

/**
 * メッセージが送信されたVCに
 */
export async function execute(message: Message): Promise<void> {
	if (!container.current) return;

	const guild = message.guild;

	if (!guild) return;

	if (!message.channel.isSendable()) return;

	if (message.content !== '読み上げ開始') return;
	const store = container.current.getDataStore();

	const member = await fetchMember(guild, {
		memberId: message.author.id,
	});

	if (!member) return;

	const voiceChannel = member.voice.channel;

	if (!voiceChannel) {
		sendErrorMessage(message.channel, 'VCに接続してから実行してね!');
		return;
	}

	const { connection, client } = getBlankVoiceConnection(
		message,
		voiceChannel.id,
	);

	if (!connection || !client.user) {
		sendErrorMessage(
			message.channel,
			'既にBOTが全て接続済みだったので、接続できませんでした。',
		);
		return;
	}

	const guildInfo = await store.do(async (db) => {
		let [result] = await getGuildInfo(db, { guildId: guild.id });

		if (!result) {
			result = await createGuildInfo(db, guild.id);
		}
		return result;
	});

	await message.channel.send({
		components: [
			createjoinVoicePanelComponent(client.user, voiceChannel, guildInfo),
		],
		flags: MessageFlags.IsComponentsV2,
	});
}
