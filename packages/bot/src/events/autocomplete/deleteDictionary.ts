import { getDictionaries } from '@tts/db';
import { type AutocompleteInteraction, Events } from 'discord.js';

import { container } from '../../container';

export const name = Events.InteractionCreate;
export const once = false;
export async function execute(
	interaction: AutocompleteInteraction,
): Promise<void> {
	if (!container.current) return;

	if (!interaction.isAutocomplete()) return;

	if (!['辞書削除'].includes(interaction.commandName)) return;

	if (!interaction.channel?.isSendable()) return;

	const store = container.current.getDataStore();

	const guild = interaction.guild;

	if (!guild) return;

	const dictionaries = await store.do(async (db) => {
		return await getDictionaries(db, guild.id);
	});

	if (dictionaries.length === 0) {
		await interaction.respond([
			{
				name: `このサーバーの辞書設定が見つかりませんでした。`,
				value: '0',
			},
		]);
		return;
	}

	await interaction.respond(
		dictionaries.map((dict) => {
			return { name: dict.beforeWord, value: dict.beforeWord };
		}),
	);
}
