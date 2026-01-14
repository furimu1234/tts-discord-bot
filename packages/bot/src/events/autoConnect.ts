import { createVoiceInfo, getAutoConnect, getVoiceInfo } from '@tts/db';
import { messageID, SendError, wrapSendError } from '@tts/lib';
import { Events, MessageFlags, type VoiceState } from 'discord.js';
import { makeMenuComponent } from '../components';
import { makeMiniMenuComponent } from '../components/embeds';
import { container } from '../container';
import { createVoiceConnection } from '../utils/connection';
import { createInitVoiceInfo } from '../utils/voiceInfo';

export const name = Events.VoiceStateUpdate;
export const once = false;
export async function execute(
	before: VoiceState,
	after: VoiceState,
): Promise<void> {
	if (before.channel && after.channel && before.channel.id === after.channel.id)
		return;

	const afterChannel = after.channel;

	if (!afterChannel) return;

	await wrapSendError(
		{
			ephemeral: false,
			channel: afterChannel,
		},
		async () => await main(after),
	);
}

const main = async (after: VoiceState) => {
	if (!after.member) return;
	if (!after.channel) return;
	if (after.member.user.bot) return;

	if (!container.current) return;

	const store = container.current.getDataStore();

	const guild = after.guild;
	if (!guild) return;

	const remaining = after.guild.voiceStates.cache.filter(
		(vs) => vs.channelId === after.channel?.id && !vs.member?.user.bot,
	);

	if (remaining.size === 0) return;

	if (after.channel.members.get(after.client.user.id)) return;

	if (!after.channel?.isSendable()) return;
	const member = after.member;

	const isAutoConnect = await store.do(async (db) => {
		return await getAutoConnect(db, after.channel?.id || '').then(
			(m) => m !== undefined,
		);
	});
	if (!isAutoConnect) return;

	const model = await store.do(async (db) => {
		const model = await getVoiceInfo(db, member.id);

		if (!model) {
			const voiceInfo = createInitVoiceInfo();

			await createVoiceInfo(db, member.id, voiceInfo);

			return await getVoiceInfo(db, member.id);
		}

		return model;
	});
	if (!model) throw new SendError(messageID.E00001(), false);

	const connection = await createVoiceConnection(
		after.client,
		guild,
		after.channel.id,
	);

	if (!connection) throw new SendError(messageID.E00006(), false);

	const { embed, components } = makeMiniMenuComponent();

	await after.channel.send(`${member.voice.channel?.name}に自動接続しました。`);
	await after.channel.send({
		embeds: [embed],
		components: components,
	});
};
