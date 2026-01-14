import { getVoiceConnection } from '@discordjs/voice';
import { messageID, SendError, wrapSendError } from '@tts/lib';
import { Events, type VoiceState } from 'discord.js';
import { container } from '../container';

export const name = Events.VoiceStateUpdate;
export const once = false;
export async function execute(
	before: VoiceState,
	after: VoiceState,
): Promise<void> {
	if (before.channel && after.channel && before.channel.id === after.channel.id)
		return;

	const beforeChannel = before.channel;

	if (!beforeChannel) return;

	await wrapSendError(
		{
			ephemeral: false,
			channel: beforeChannel,
		},
		async () => await main(before),
	);
}

const main = async (before: VoiceState) => {
	if (!before.member) return;
	if (!before.channel) return;
	if (before.member.user.bot) return;

	if (!container.current) return;

	const guild = before.guild;
	if (!guild) return;

	const remaining = before.guild.voiceStates.cache.filter(
		(vs) => vs.channelId === before.channel?.id && !vs.member?.user.bot,
	);

	if (remaining.size > 0) return;

	if (!before.channel.members.get(before.client.user.id)) return;

	if (!before.channel?.isSendable()) return;

	const connection = await getVoiceConnection(guild.id, before.client.user.id);

	if (!connection) throw new SendError(messageID.E00007(), false);
	await connection.disconnect();

	await before.channel.send(`${before.channel.name}から自動退出しました`);
};
