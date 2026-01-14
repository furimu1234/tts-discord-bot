import { getMemberById, messageID, SendError, wrapSendError } from '@tts/lib';
import {
	type CommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import { makeMenuComponent } from '../components';
import { createVoiceConnection } from '../utils/connection';

export const data = new SlashCommandBuilder()
	.setName('読み上げ開始')
	.setDescription('コマンド実行者が接続してるチャンネルで読み上げを開始します');

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
	if (!member.voice.channelId) throw new SendError(messageID.E00005(), false);

	const connection = await createVoiceConnection(
		interaction.client,
		guild,
		member.voice.channelId,
	);

	if (!connection) throw new SendError(messageID.E00006(), false);

	await interaction.followUp(`${member.voice.channel?.name}に接続しました。`);
	await interaction.channel.send({
		components: [await makeMenuComponent(member, interaction.channel)],
		flags: MessageFlags.IsComponentsV2,
	});
};
