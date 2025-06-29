import { eq, or } from 'drizzle-orm';
import { guildInfo, type guildInfoFilter } from '../';
import type { SchemaDB } from '../client';

/**
 * サーバー設定取得
 * @param db drizzle
 * @returns
 */
export async function getGuildInfo(
	db: SchemaDB,
	filter: Partial<guildInfoFilter>,
) {
	const results = await db.query.guildInfo.findMany({
		where: or(
			filter.guildId !== undefined
				? eq(guildInfo.guildId, filter.guildId)
				: undefined,
			filter.textLength !== undefined
				? eq(guildInfo.textLength, filter.textLength)
				: undefined,
		),
	});
	return results;
}
