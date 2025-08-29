import { guildInfo } from '../';
import type { SchemaDB } from '../client';

/**
 * サーバ設定作成
 * @param db drizzle
 * @param guildId サーバーID
 * @returns
 */
export async function createGuildInfo(db: SchemaDB, guildId: string) {
	const results = await db
		.insert(guildInfo)
		.values({
			guildId: guildId,
		})
		.returning({ id: guildInfo.id });

	if (results.length === 0) throw new Error('');

	return results[0].id;
}
