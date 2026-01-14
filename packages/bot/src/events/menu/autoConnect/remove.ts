import { deleteAutoConnect } from '@tts/db';
import { selector, sendMessageThenDelete, wrapSendError } from '@tts/lib';
import {
	type ButtonInteraction,
	ChannelType,
	Events,
	type Interaction,
} from 'discord.js';
import { container } from '../../../container';

export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction: Interaction): Promise<void> {
	if (!interaction.isButton()) return;

	const customId = interaction.customId;

	if (!customId.startsWith('rem_autoconnect')) return;
	await interaction.deferUpdate();

	await wrapSendError(
		{ ephemeral: true, interaction: interaction },
		async () => await main(interaction),
	);
}

const main = async (interaction: ButtonInteraction) => {
	if (!container.current) return;

	if (!interaction.channel?.isSendable()) return;

	const store = container.current.getDataStore();
	const guild = interaction.guild;

	if (!guild) return;

	const interactionChannel = interaction.channel;

	if (!interactionChannel.isSendable()) return;

	const vcSelect = selector(
		interaction.channel,
		'自動接続設定を削除するVCを選択してください',
	);
	vcSelect.setMaxSize(1);

	const vcValues = await vcSelect.channel(
		guild,
		ChannelType.GuildVoice,
		ChannelType.GuildStageVoice,
	);

	const voiceChannel = vcValues[0];

	if (
		![ChannelType.GuildStageVoice, ChannelType.GuildVoice].includes(
			voiceChannel.type,
		)
	)
		return;

	await store.do(async (db) => {
		await deleteAutoConnect(db, voiceChannel.id);
	});

	await sendMessageThenDelete(
		{
			content: `${voiceChannel.name}を自動接続設定から削除しました!`,
			sleepSecond: 15,
		},
		interaction,
	);
};
