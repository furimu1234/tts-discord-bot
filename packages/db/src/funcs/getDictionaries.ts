import { eq, or } from 'drizzle-orm';
import { dictionary, type dictionaryFilter } from '../';
import type { SchemaDB } from '../client';

/**
 * 辞書一覧取得
 * @param db drizzle
 * @returns
 */
export async function getDictionaries(
	db: SchemaDB,
	filter: Partial<dictionaryFilter>,
) {
	const results = await db.query.dictionary.findMany({
		where: or(
			filter.beforeWord
				? eq(dictionary.beforeWord, filter.beforeWord)
				: undefined,
			filter.parentId ? eq(dictionary.parentId, filter.parentId) : undefined,
			filter.id ? eq(dictionary.id, filter.id) : undefined,
		),
	});
	return results;
}
