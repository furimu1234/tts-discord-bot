import { getAutoConnects } from '@tts/db';
import { wrapSendError } from '@tts/lib';
import {
	type ButtonInteraction,
	channelMention,
	Events,
	type Interaction,
} from 'discord.js';
import { container } from '../../../container';
import { autoConnectTextType, autoConnectVoiceType } from '../../../utils';

export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction: Interaction): Promise<void> {
	if (!interaction.isButton()) return;

	const customId = interaction.customId;

	if (!customId.startsWith('list_autoconnect')) return;
	await interaction.deferUpdate();

	await wrapSendError(
		{ ephemeral: true, interaction: interaction },
		async () => await main(interaction),
	);
}

const main = async (interaction: ButtonInteraction) => {
	if (!container.current) return;

	if (!interaction.channel?.isSendable()) return;

	const store = container.current.getDataStore();
	const guild = interaction.guild;

	if (!guild) return;

	const interactionChannel = interaction.channel;

	if (!interactionChannel.isSendable()) return;

	const models = await store.do(async (db) => {
		return await getAutoConnects(db, guild.id);
	});

	let content = models
		.flatMap((m) => {
			const voice = guild.channels.cache
				.filter((c) => autoConnectVoiceType.includes(c.type))
				.get(m.voiceId);

			if (!voice) return [];

			const text = guild.channels.cache
				.filter((c) => autoConnectTextType.includes(c.type))
				.get(m.textId);
			if (!text) return [];

			return `- ${channelMention(voice.id)} - ${channelMention(text.id)}`;
		})
		.join('\n');

	if (models.length === 0) {
		content = `このサーバーの設定はありません!`;
	}

	await interaction.followUp({ content: `自動接続設定一覧\n${content}` });
};
