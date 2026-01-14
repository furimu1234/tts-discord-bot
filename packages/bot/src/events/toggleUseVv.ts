import { createVoiceInfo, getVoiceInfo, updateMainVoiceInfo } from '@tts/db';
import { messageID, SendError, wrapSendError } from '@tts/lib';
import { Events, type Interaction, MessageFlags } from 'discord.js';

import { makeVoiceInfoComponent } from '../components';
import { container } from '../container';
import { createInitVoiceInfo } from '../utils/voiceInfo';

export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction: Interaction): Promise<void> {
	if (!container.current) return;

	if (!interaction.isButton()) return;

	const customId = interaction.customId;

	if (!customId.startsWith('toggle_use_vv')) return;

	const store = container.current.getDataStore();

	const user = interaction.user;

	await wrapSendError(
		{ ephemeral: true, interaction: interaction },
		async () => {
			await interaction.deferUpdate({});

			const model = await store.do(async (db) => {
				let model = await getVoiceInfo(db, user.id);

				if (!model) {
					throw new SendError(messageID.E00001(), false);
				}

				model.main.useVv = !model.main.useVv;
				await updateMainVoiceInfo(db, user.id, model.main);

				if (!model.sub) {
					throw new SendError(messageID.E00002(), false);
				}

				if (model.main.useVv && !model.main.vvId) {
					const newVoiceInfo = createInitVoiceInfo({ useVv: true });
					await createVoiceInfo(db, user.id, newVoiceInfo);
				} else if (!model.main.useVv && !model.main.vtId) {
					const newVoiceInfo = createInitVoiceInfo({ useVv: false });
					await createVoiceInfo(db, user.id, newVoiceInfo);
				}
				model = await getVoiceInfo(db, user.id);
				if (!model) {
					throw new SendError(messageID.E00001(), false);
				}
				const component = await makeVoiceInfoComponent(db, model);

				await interaction.editReply({
					components: [component],
					flags: MessageFlags.IsComponentsV2,
				});

				return model;
			});

			await interaction.followUp({
				content: `ボイスエンジンを${model.main.useVv ? 'VoiceVox' : 'Voice Text Web API'}にしました`,
				flags: MessageFlags.Ephemeral,
			});
		},
	);
}
