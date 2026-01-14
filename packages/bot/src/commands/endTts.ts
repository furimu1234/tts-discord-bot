import { getVoiceConnection } from '@discordjs/voice';
import { getMemberById, messageID, SendError, wrapSendError } from '@tts/lib';
import { type CommandInteraction, SlashCommandBuilder } from 'discord.js';
export const data = new SlashCommandBuilder()
	.setName('読み上げ終了')
	.setDescription('このBOTをVCから退出させます');

export async function execute(interaction: CommandInteraction) {
	await interaction.deferReply();

	if (!interaction.channel?.isSendable()) return;

	await wrapSendError(
		{ ephemeral: false, channel: interaction.channel },
		async () => await main(interaction),
	);
}

const main = async (interaction: CommandInteraction) => {
	const guild = interaction.guild;

	if (!guild) return;

	if (!interaction.channel?.isSendable()) return;

	const member = await getMemberById(guild, interaction.user.id);
	if (!member) throw new SendError(messageID.E00004(), false);
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

	await interaction.editReply(`${member.voice.channel.name}から退出しました`);
};
