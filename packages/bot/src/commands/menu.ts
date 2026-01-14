import { wrapSendError } from '@tts/lib';
import {
	type CommandInteraction,
	type GuildMember,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import { makeMenuComponent } from '../components';
import { container } from '../container';

export const data = new SlashCommandBuilder()
	.setName('メニュー')
	.setDescription('読み上げ開始や設定をボタンのみで出来るコマンドです');

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

	const guild = interaction.guild;

	if (!guild) return;

	const member = interaction.member as GuildMember;
	if (!member) return;

	const menuComponent = await makeMenuComponent(member);
	await interaction.followUp({
		components: [menuComponent],
		flags: MessageFlags.IsComponentsV2,
	});
};
