import { createVoiceInfo, getVoiceInfo } from '@tts/db';
import {
	type CommandInteraction,
	Message,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import { makeVoiceInfoComponent } from '../components';
import { container } from '../container';
import { createInitVoiceInfo } from '../utils/voiceInfo';
export const data = new SlashCommandBuilder()
	.setName('読み上げ音声設定')
	.setDescription('設定済みの読み込みメッセージを確認します');

export async function execute(interaction: CommandInteraction) {
	if (!container.current) return;

	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

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
}
