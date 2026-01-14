import { getMaster, getVoiceInfo, updateVoiceVox, updateVT } from '@tts/db';
import {
	messageID,
	SendError,
	vtEmotionLevelSchema,
	wrapSendError,
} from '@tts/lib';
import {
	Events,
	type Interaction,
	MessageFlags,
	type StringSelectMenuInteraction,
} from 'discord.js';
import { makeVoiceInfoComponent } from '../../../components';
import { container } from '../../../container';

export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction: Interaction): Promise<void> {
	if (!interaction.isStringSelectMenu()) return;

	if (!interaction.customId.startsWith('select-vt-emotionlevel')) return;
	await interaction.deferUpdate();

	await wrapSendError(
		{
			ephemeral: true,
			interaction: interaction,
		},
		async () => {
			await main(interaction);
		},
	);
}

const main = async (interaction: StringSelectMenuInteraction) => {
	if (!container.current) return;
	const value = interaction.values[0];

	const store = container.current.getDataStore();
	const updatedEmotion = await store.do(async (db) => {
		let voiceInfoModel = await getVoiceInfo(db, interaction.user.id);

		if (!voiceInfoModel) throw new SendError(messageID.E00002(), false);

		const parsed = vtEmotionLevelSchema.safeParse(Number(value));

		if (!parsed.success)
			throw new SendError(messageID.E00003('感情レベル'), false);

		await updateVT(db, interaction.user.id, {
			emotionLevel: parsed.data,
		});

		voiceInfoModel = await getVoiceInfo(db, interaction.user.id);

		if (!voiceInfoModel) throw new SendError(messageID.E00002(), false);

		const component = await makeVoiceInfoComponent(db, voiceInfoModel);

		await interaction.editReply({
			components: [component],
			flags: MessageFlags.IsComponentsV2,
		});

		return value;
	});

	await interaction.followUp({
		content: `感情レベルを${updatedEmotion}に変更しました!`,
		flags: MessageFlags.Ephemeral,
	});
};
