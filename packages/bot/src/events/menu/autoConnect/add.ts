import { createAutoConnect, getAutoConnect, updateAutoConnect } from '@tts/db';
import {
	confirmDialog,
	selector,
	sendMessageThenDelete,
	wrapSendError,
} from '@tts/lib';
import {
	type ButtonInteraction,
	ChannelType,
	channelMention,
	Events,
	type Interaction,
} from 'discord.js';
import { container } from '../../../container';

export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction: Interaction): Promise<void> {
	if (!interaction.isButton()) return;

	const customId = interaction.customId;

	if (!customId.startsWith('add_autoconnect')) return;
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
		'自動入室するVCを選択してください',
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

	const tcSelect = selector(
		interaction.channel,
		'自動入室した時に読み上げるTCを選択してください。',
	);
	vcSelect.setMaxSize(1);

	const values = await tcSelect.channel(
		guild,
		ChannelType.GuildVoice,
		ChannelType.GuildStageVoice,
		ChannelType.GuildText,
	);

	const textChannel = values[0];

	if (
		![
			ChannelType.GuildStageVoice,
			ChannelType.GuildVoice,
			ChannelType.GuildText,
		].includes(voiceChannel.type)
	)
		return;

	await store.do(async (db) => {
		const model = await getAutoConnect(db, voiceChannel.id);

		if (model) {
			const confirm = confirmDialog(
				interactionChannel,
				`既に${channelMention(voiceChannel.id)}は自動接続に登録されてます。更新してもいいですか？\n- 更新前\nVC: ${channelMention(model.voiceId)}\nTC: ${channelMention(model.textId)}\n- 更新後\nVC: ${channelMention(model.voiceId)}\nTC: ${channelMention(textChannel.id)}`,
			);

			const confirmResult = await confirm.send(true);
			if (!confirmResult) return;

			await updateAutoConnect(db, voiceChannel.id, textChannel.id);
		} else {
			await createAutoConnect(db, guild.id, voiceChannel.id, textChannel.id);
		}
	});

	const parent = voiceChannel.parent ? `${voiceChannel.parent?.name}-` : '';

	await sendMessageThenDelete(
		{
			content: `${parent}${voiceChannel.name}に接続した時に自動接続するようにしました!`,
			sleepSecond: 15,
		},
		interaction,
	);
};
