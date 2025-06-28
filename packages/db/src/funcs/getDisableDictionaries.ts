import { and, eq, inArray } from 'drizzle-orm';
import { dictionaryEnable } from '..';
import type { SchemaDB } from '../client';

/**
 * グローバル無効辞書取得
 * @param db drizzle
 * @returns
 */
export async function getDisableDictionaries(db: SchemaDB, ids: number[]) {
	const results = await db.query.dictionaryEnable.findMany({
		where: and(
			inArray(dictionaryEnable.dictionaryId, ids),
			eq(dictionaryEnable.disabled, true),
		),
	});
	return results;
}
