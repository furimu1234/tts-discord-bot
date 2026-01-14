import { createAutoConnect, getAutoConnect, updateAutoConnect } from '@tts/db';
import { confirmDialog, messageID, SendError, wrapSendError } from '@tts/lib';
import {
	ChannelType,
	type CommandInteraction,
	channelMention,
	SlashCommandBuilder,
	SlashCommandChannelOption,
} from 'discord.js';
import { container } from '../container';

export const data = new SlashCommandBuilder()
	.setName('自動接続登録-更新')
	.setDescription('自動接続を登録します');

data.addChannelOption(
	new SlashCommandChannelOption()
		.addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
		.setName('自動接続するvc')
		.setDescription('自動接続するvcを指定してください')
		.setRequired(true),
);
data.addChannelOption(
	new SlashCommandChannelOption()
		.addChannelTypes(
			ChannelType.GuildText,
			ChannelType.GuildVoice,
			ChannelType.GuildStageVoice,
		)
		.setName('読み上げ対象のtc')
		.setDescription('自動接続時に読み上げをするtcを指定してください')
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

	const rawVoiceChannel = interaction.options.getChannel('自動接続するvc');
	const rawTextChannel = interaction.options.getChannel('読み上げ対象のtc');

	const voiceChannel = guild.channels.cache.find(
		(c) => c.id === rawVoiceChannel?.id,
	);
	if (!voiceChannel) throw new SendError(messageID.E00004(), false);
	const textChannel = guild.channels.cache.find(
		(c) => c.id === rawTextChannel?.id,
	);
	if (!textChannel) throw new SendError(messageID.E00004(), false);

	const result = await store.do(async (db) => {
		const model = await getAutoConnect(db, voiceChannel.id);
		if (model) {
			const confirm = confirmDialog(
				interactionChannel,
				`既に${channelMention(voiceChannel.id)}は自動接続に登録されてます。更新してもいいですか？\n- 更新前\nVC: ${channelMention(model.voiceId)}\nTC: ${channelMention(model.textId)}\n- 更新後\nVC: ${channelMention(model.voiceId)}\nTC: ${channelMention(textChannel.id)}`,
			);

			const confirmResult = await confirm.send(true);
			if (!confirmResult) return false;

			await updateAutoConnect(db, voiceChannel.id, textChannel.id);
		} else {
			await createAutoConnect(db, guild.id, voiceChannel.id, textChannel.id);
		}

		return true;
	});

	if (!result) return;

	const parent = voiceChannel.parent ? `${voiceChannel.parent?.name}-` : '';

	await interaction.followUp({
		content: `${parent}${voiceChannel.name}に接続した時に自動接続するようにしました!`,
	});
};
