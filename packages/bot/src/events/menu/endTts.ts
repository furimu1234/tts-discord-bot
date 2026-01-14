import { getVoiceConnection } from '@discordjs/voice';
import { messageID, SendError, wrapSendError } from '@tts/lib';
import { type ButtonInteraction, Events, type Interaction } from 'discord.js';
export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction: Interaction): Promise<void> {
	if (!interaction.isButton()) return;

	const customId = interaction.customId;

	if (!customId.startsWith('end_tts')) return;
	await interaction.deferReply();

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
	if (!member.voice.channel) throw new SendError(messageID.E00005(), false);

	const botChannel = guild.voiceStates.cache.get(
		interaction.client.user.id,
	)?.channel;

	//BOTと同じVCに居る場合のみ使用可能

	if (member.voice.channel.id !== botChannel?.id)
		throw new SendError(messageID.E00008(interaction.client.user.id), false);

	const connection = await getVoiceConnection(
		guild.id,
		interaction.client.user.id,
	);

	if (!connection) throw new SendError(messageID.E00007(), false);
	await connection.disconnect();
	connection.destroy();

	await interaction.editReply(`${member.voice.channel.name}から退出しました`);
};
