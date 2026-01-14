import { getVoiceInfo, updateVoiceVox } from '@tts/db';
import {
	Dialog,
	generateRandomString,
	messageID,
	SendError,
	vvIntnationSchema,
} from '@tts/lib';
import {
	type ButtonInteraction,
	Events,
	type Interaction,
	LabelBuilder,
	MessageFlags,
	TextDisplayBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { makeVoiceInfoComponent } from '../../../components';
import { container } from '../../../container';
export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction: Interaction): Promise<void> {
	if (!container.current) return;

	if (!interaction.isButton()) return;

	if (!interaction.customId.startsWith('edit_intnation')) return;

	const store = container.current.getDataStore();

	await store.do(async (db) => {
		let voiceInfoModel = await getVoiceInfo(db, interaction.user.id);

		if (!voiceInfoModel) throw new SendError(messageID.E00002(), false);

		if (!voiceInfoModel.sub) throw new SendError(messageID.E00002(), false);

		if (!('intnation' in voiceInfoModel.sub))
			throw new SendError(messageID.E00002(), false);

		const intnation = await inputToNumber(
			interaction,
			voiceInfoModel.sub.intnation,
		);
		await updateVoiceVox(db, interaction.user.id, {
			intnation: intnation,
		});

		voiceInfoModel = await getVoiceInfo(db, interaction.user.id);
		if (!voiceInfoModel) throw new SendError(messageID.E00002(), false);

		const component = await makeVoiceInfoComponent(db, voiceInfoModel);

		await interaction.editReply({
			components: [component],
			flags: MessageFlags.IsComponentsV2,
		});
	});
}

/**
 * 設定を変更するか確認するためのパネル
 * @param interaction
 * @param store
 * @returns 変更前のモデル
 */
const inputToNumber = async (
	interaction: ButtonInteraction,
	intnation: number,
) => {
	const textAreaCustomId = generateRandomString();

	const input = new TextInputBuilder()
		.setCustomId(textAreaCustomId)
		.setMaxLength(4)
		.setMinLength(1)
		.setRequired(true)
		.setStyle(TextInputStyle.Short)
		.setValue(intnation.toString());

	const descriptionComponent = new TextDisplayBuilder({
		content: '# イントネーションを設定します。\n範囲は0.00 ~ 2.00の間です。',
	});

	const inputComponent = new LabelBuilder({
		label: '入力欄',
	}).setTextInputComponent(input);

	const dialog = Dialog();

	const intnationModalResult = await dialog.modal(interaction, {
		title: 'イントネーション変更画面',
		customId: generateRandomString(),
		fields: [
			{ type: 'text', builder: descriptionComponent },
			{ type: 'label', builder: inputComponent },
		],
	});

	// モーダルに入力されたイントネーションを取得する
	const intnationString =
		intnationModalResult.getTextInputValue(textAreaCustomId);

	const parsed = vvIntnationSchema.safeParse(
		Number.parseFloat(intnationString),
	);

	if (!parsed.data) {
		throw new SendError('', false);
	}

	return parsed.data;
};
