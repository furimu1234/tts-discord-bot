import {
	createDictionary,
	deleteDictionary,
	getDictionary,
	updateDictionary,
} from '@tts/db';
import { confirmDialog, wrapSendError } from '@tts/lib';
import {
	type CommandInteraction,
	SlashCommandBuilder,
	SlashCommandStringOption,
} from 'discord.js';
import { container } from '../container';

export const data = new SlashCommandBuilder()
	.setName('辞書削除')
	.setDescription('辞書を削除します');

data.addStringOption(
	new SlashCommandStringOption()
		.setName('削除する置換前単語')
		.setDescription('置換前単語を入力してください')
		.setRequired(true)
		.setAutocomplete(true),
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

	const beforeWord = interaction.options.getString('削除する置換前単語');

	if (!beforeWord) return;

	await store.do(async (db) => {
		const model = await getDictionary(db, guild.id, beforeWord);

		if (model) {
			const confirm = confirmDialog(
				interactionChannel,
				`${beforeWord}を本当に削除していいですか？\n\`\`\`\n- 置換前: ${beforeWord}\n- 置換後: ${model.afterWord}\`\`\``,
			);

			const confirmResult = await confirm.send(true);
			if (!confirmResult) return;
			await deleteDictionary(db, guild.id, beforeWord);
		}
	});

	await interaction.followUp({
		content: `${beforeWord}の辞書を削除しました`,
	});
};
