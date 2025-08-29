import { guildInfo, voiceConnection } from '../';
import type { SchemaDB } from '../client';

/**
 * ボイスコネクションを作成する(自動接続用)
 * @param db drizzle
 * @param guildId サーバーID
 * @returns
 */
export async function createVoiceConnect(
	db: SchemaDB,
	guildId: string,
	voiceId: string,
	textId: string,
) {
	const results = await db
		.insert(voiceConnection)
		.values({
			guildId: guildId,
			voiceId: voiceId,
			textId: textId,
		})
		.returning({ id: guildInfo.id });

	if (results.length === 0) throw new Error('');

	return results[0].id;
}
