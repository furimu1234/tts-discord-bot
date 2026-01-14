import { deleteDictionary, getDictionary } from '@tts/db';
import {
	confirmDialog,
	Dialog,
	generateRandomString,
	wrapSendError,
} from '@tts/lib';
import {
	type ButtonInteraction,
	Events,
	type Interaction,
	LabelBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { container } from '../../../container';

export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction: Interaction): Promise<void> {
	if (!interaction.isButton()) return;

	const customId = interaction.customId;

	if (!customId.startsWith('rem_dict')) return;

	await wrapSendError(
		{ ephemeral: true, interaction: interaction },
		async () => await main(interaction),
	);
}

const main = async (interaction: ButtonInteraction) => {
	if (!container.current) return;

	const store = container.current.getDataStore();
	const guild = interaction.guild;

	if (!guild) return;

	const interactionChannel = interaction.channel;

	if (!interactionChannel?.isSendable()) return;

	const { beforeWord } = await inputWords(interaction);

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

const inputWords = async (interaction: ButtonInteraction) => {
	const dialog = Dialog();
	const beforewordCustomId = generateRandomString();

	const beforeWordInput = new TextInputBuilder()
		.setCustomId(beforewordCustomId)
		.setMaxLength(100)
		.setMinLength(1)
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const beforewordComponent = new LabelBuilder({
		label: '置換前単語を入力してください',
	}).setTextInputComponent(beforeWordInput);

	const result = await dialog.modal(interaction, {
		customId: 'add_dict_modal',
		title: '辞書追加画面',
		fields: [{ type: 'label', builder: beforewordComponent }],
	});

	return {
		beforeWord: result.getTextInputValue(beforewordCustomId),
	};
};
