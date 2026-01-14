import { createVoiceInfo, getVoiceInfo } from '@tts/db';
import { wrapSendError } from '@tts/lib';
import {
	type ButtonInteraction,
	Events,
	type Interaction,
	MessageFlags,
} from 'discord.js';
import { makeVoiceInfoComponent } from '../../components';
import { container } from '../../container';
import { createInitVoiceInfo } from '../../utils/voiceInfo';

export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction: Interaction): Promise<void> {
	if (!interaction.isButton()) return;

	const customId = interaction.customId;

	if (!customId.startsWith('show_tts_menu')) return;
	await interaction.deferUpdate();

	await wrapSendError(
		{ ephemeral: true, interaction: interaction },
		async () => await main(interaction),
	);
}

const main = async (interaction: ButtonInteraction) => {
	if (!container.current) return;

	const store = container.current.getDataStore();

	const user = interaction.user;

	let model = await store.do(async (db) => {
		return await getVoiceInfo(db, user.id);
	});

	if (!model) {
		model = await store.do(async (db) => {
			const voiceInfo = createInitVoiceInfo();

			await createVoiceInfo(db, user.id, voiceInfo);
			return await getVoiceInfo(db, user.id);
		});
	}

	if (!model) return;

	await store.do(async (db) => {
		const component = await makeVoiceInfoComponent(db, model);

		await interaction.followUp({
			components: [component],
			flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
		});
	});
};
