import {
	createAutoConnect,
	createDictionary,
	getAutoConnect,
	getDictionaries,
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

	if (!customId.startsWith('list_dict')) return;
	await interaction.deferUpdate();

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

	const models = await store.do(async (db) => {
		return await getDictionaries(db, guild.id);
	});

	let content = '## 一覧の見方\n```\n- 置換前単語\n- 置換後単語```\n';

	const result = models
		.map((model) => {
			return `\`\`\`\n- ${model.beforeWord}\n- ${model.afterWord}\n\`\`\``;
		})
		.join('\n');

	content += result;

	await interaction.followUp({ content });
};
