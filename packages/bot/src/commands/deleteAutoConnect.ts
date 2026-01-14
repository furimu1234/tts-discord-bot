import { deleteAutoConnect, getAutoConnect } from '@tts/db';
import { messageID, SendError, wrapSendError } from '@tts/lib';
import {
	ChannelType,
	type CommandInteraction,
	SlashCommandBuilder,
	SlashCommandChannelOption,
} from 'discord.js';
import { container } from '../container';

export const data = new SlashCommandBuilder()
	.setName('自動接続削除')
	.setDescription('自動接続を削除します');

data.addChannelOption(
	new SlashCommandChannelOption()
		.addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
		.setName('削除対象vc')
		.setDescription('自動接続設定から削除するvcを指定してください。')
		.setRequired(true),
);

export async function execute(interaction: CommandInteraction) {
	await interaction.deferReply();

	if (!interaction.channel?.isSendable()) return;

	await wrapSendError(
		{ ephemeral: false, channel: interaction.channel },
		async () => await main(interaction),
	);
}

const main = async (interaction: CommandInteraction) => {
	if (!container.current) return;
	const store = container.current.getDataStore();

	const guild = interaction.guild;

	if (!guild) return;

	if (!interaction.isChatInputCommand()) return;

	const interactionChannel = interaction.channel;
	if (!interactionChannel?.isSendable()) return;

	const rawVoiceChannel = interaction.options.getChannel('削除対象vc');

	const voiceChannel = guild.channels.cache.find(
		(c) => c.id === rawVoiceChannel?.id,
	);
	if (!voiceChannel) throw new SendError(messageID.E00004(), false);

	await store.do(async (db) => {
		const model = await getAutoConnect(db, voiceChannel.id);

		if (!model) return;

		await deleteAutoConnect(db, voiceChannel.id);
	});

	await interaction.followUp({
		content: `${voiceChannel.name}を自動接続設定から削除しました!`,
	});
};
