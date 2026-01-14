import { createDictionary, getDictionary, updateDictionary } from '@tts/db';
import { confirmDialog, wrapSendError } from '@tts/lib';
import {
	type CommandInteraction,
	SlashCommandBuilder,
	SlashCommandStringOption,
} from 'discord.js';
import { container } from '../container';

export const data = new SlashCommandBuilder()
	.setName('辞書登録-更新')
	.setDescription('辞書を登録します');

data.addStringOption(
	new SlashCommandStringOption()
		.setName('置換前単語')
		.setDescription('置換前単語を入力してください')
		.setRequired(true),
);

data.addStringOption(
	new SlashCommandStringOption()
		.setName('置換後単語')
		.setDescription('置換後の単語を入力してください')
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

	const beforeWord = interaction.options.getString('置換前単語');
	const afterWord = interaction.options.getString('置換後単語');

	if (!beforeWord) return;
	if (!afterWord) return;

	const result = await store.do(async (db) => {
		const model = await getDictionary(db, guild.id, beforeWord);
		if (model) {
			const confirm = confirmDialog(
				interactionChannel,
				`${beforeWord}は既に登録されてます。読み方を変更しますか？\n## 変更前\n\`\`\`- 置換前: ${model.beforeWord}\n- 置換後: ${model.afterWord}\`\`\`\n## 変更後\n\`\`\`- 置換前: ${model.beforeWord}\n- 置換後: ${afterWord}\`\`\``,
			);

			const confirmResult = await confirm.send(true);
			if (!confirmResult) return false;

			await updateDictionary(db, guild.id, beforeWord, afterWord);
		} else {
			await createDictionary(db, guild.id, beforeWord, afterWord);
		}

		return true;
	});

	if (!result) return;

	await interaction.followUp({
		content: `${beforeWord}を${afterWord}と読むようにしたよ`,
	});
};
