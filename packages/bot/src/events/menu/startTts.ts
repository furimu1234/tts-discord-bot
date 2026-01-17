import { messageID, SendError, wrapSendError } from '@tts/lib';
import { type ButtonInteraction, Events, type Interaction } from 'discord.js';

import { makeMiniMenuComponent } from '../../components/embeds';
import { createVoiceConnection } from '../../utils/connection';

export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction: Interaction): Promise<void> {
	if (!interaction.isButton()) return;

	const customId = interaction.customId;

	if (!customId.startsWith('start_tts')) return;
	await interaction.deferUpdate();

	await wrapSendError(
		{ ephemeral: true, interaction: interaction },
		async () => await main(interaction),
	);
}

const main = async (interaction: ButtonInteraction) => {
	const guild = interaction.guild;

	if (!guild) return;

	if (!interaction.channel?.isSendable()) return;

	const member = interaction.member;
	if (!member || !('voice' in member))
		throw new SendError(messageID.E00004(), false);
	if (!member.voice.channelId) throw new SendError(messageID.E00005(), false);

	const connection = await createVoiceConnection(
		interaction.client,
		guild,
		member.voice.channelId,
	);

	if (!connection) throw new SendError(messageID.E00006(), false);

	const { embed, components } = makeMiniMenuComponent();

	await interaction.followUp(`${member.voice.channel?.name}に接続しました。`);
	await interaction.channel.send({
		embeds: [embed],
		components: components,
	});
};
