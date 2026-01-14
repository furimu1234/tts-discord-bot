import { getMaster, getVoiceInfo, updateVoiceVox, updateVT } from '@tts/db';
import { messageID, SendError, wrapSendError } from '@tts/lib';
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

	if (!interaction.customId.startsWith('select-vt-speaker')) return;
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
	const store = container.current.getDataStore();

	const value = interaction.values[0];

	await store.do(async (db) => {
		let voiceInfoModel = await getVoiceInfo(db, interaction.user.id);

		if (!voiceInfoModel) throw new SendError(messageID.E00002(), false);

		let masterModel = await getMaster(
			db,
			//@ts-expect-error
			value,
			voiceInfoModel.master?.emotion,
		);

		if (!masterModel) {
			masterModel = await getMaster(
				db,
				//@ts-expect-error
				value,
			);
		}

		if (!masterModel) throw new SendError(messageID.E00002(), false);

		await updateVT(db, interaction.user.id, {
			speakerId: masterModel.id,
		});

		voiceInfoModel = await getVoiceInfo(db, interaction.user.id);

		if (!voiceInfoModel) throw new SendError(messageID.E00002(), false);

		const component = await makeVoiceInfoComponent(db, voiceInfoModel);

		await interaction.editReply({
			components: [component],
			flags: MessageFlags.IsComponentsV2,
		});
	});

	await interaction.followUp({
		content: `話者を${value}に変更しました`,
		flags: MessageFlags.Ephemeral,
	});
};
