import { getVoiceInfo, updateVoiceVox, updateVT } from '@tts/db';
import {
	messageID,
	SendError,
	vtPitchSchema,
	vvPitchSchema,
	wrapSendError,
} from '@tts/lib';
import {
	Events,
	type Interaction,
	MessageFlags,
	type StringSelectMenuInteraction,
} from 'discord.js';

import { makeVoiceInfoComponent } from '../../components';
import { container } from '../../container';

export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction: Interaction): Promise<void> {
	if (!interaction.isStringSelectMenu()) return;

	if (!interaction.customId.startsWith('select-pitch')) return;

	await interaction.deferUpdate();

	await wrapSendError(
		{
			ephemeral: true,
			interaction: interaction,
		},
		async () => await main(interaction),
	);
}

const main = async (interaction: StringSelectMenuInteraction) => {
	if (!container.current) return;
	const value = interaction.values[0];
	const toNumberValue = Number(value);

	const store = container.current.getDataStore();

	await store.do(async (db) => {
		let voiceInfoModel = await getVoiceInfo(db, interaction.user.id);

		if (!voiceInfoModel) throw new SendError(messageID.E00002(), false);

		if (voiceInfoModel.main.useVv) {
			const parsed = vvPitchSchema.safeParse(toNumberValue);
			if (!parsed.success) throw new SendError(messageID.E00002(), false);
			await updateVoiceVox(db, interaction.user.id, { pitch: parsed.data });
		} else {
			const parsed = vtPitchSchema.safeParse(toNumberValue);
			if (!parsed.success) throw new SendError(messageID.E00002(), false);
			await updateVT(db, interaction.user.id, { pitch: parsed.data });
		}

		voiceInfoModel = await getVoiceInfo(db, interaction.user.id);

		if (!voiceInfoModel) throw new SendError(messageID.E00002(), false);

		const component = await makeVoiceInfoComponent(db, voiceInfoModel);

		await interaction.editReply({
			components: [component],
			flags: MessageFlags.IsComponentsV2,
		});
	});

	await interaction.followUp({
		content: `音程を${toNumberValue}に変更しました。`,
		flags: MessageFlags.Ephemeral,
	});
};
