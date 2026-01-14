import {
	createAutoConnect,
	createDictionary,
	getAutoConnect,
	getDictionary,
	updateAutoConnect,
	updateDictionary,
} from '@tts/db';
import {
	confirmDialog,
	Dialog,
	generateRandomString,
	selector,
	sendMessageThenDelete,
	wrapSendError,
} from '@tts/lib';
import {
	type ButtonInteraction,
	ChannelType,
	channelMention,
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

	if (!customId.startsWith('add_dict')) return;

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

	const { beforeWord, afterWord } = await inputWords(interaction);

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

const inputWords = async (interaction: ButtonInteraction) => {
	const dialog = Dialog();
	const beforewordCustomId = generateRandomString();
	const afterwordCustomId = generateRandomString();

	const beforeWordInput = new TextInputBuilder()
		.setCustomId(beforewordCustomId)
		.setMaxLength(100)
		.setMinLength(1)
		.setRequired(true)
		.setStyle(TextInputStyle.Short);
	const afterWordInput = new TextInputBuilder()
		.setCustomId(afterwordCustomId)
		.setMaxLength(100)
		.setMinLength(1)
		.setRequired(true)
		.setStyle(TextInputStyle.Short);

	const beforewordComponent = new LabelBuilder({
		label: '置換前単語を入力してください',
	}).setTextInputComponent(beforeWordInput);
	const afterwordComponent = new LabelBuilder({
		label: '置換後単語を入力してください',
	}).setTextInputComponent(afterWordInput);

	const result = await dialog.modal(interaction, {
		customId: 'add_dict_modal',
		title: '辞書追加画面',
		fields: [
			{ type: 'label', builder: beforewordComponent },
			{ type: 'label', builder: afterwordComponent },
		],
	});

	return {
		beforeWord: result.getTextInputValue(beforewordCustomId),
		afterWord: result.getTextInputValue(afterwordCustomId),
	};
};
