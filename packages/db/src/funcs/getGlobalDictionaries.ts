import { and, eq } from 'drizzle-orm';
import { createDictionaryEnable, dictionary } from '../';
import type { SchemaDB } from '../client';
import { geDictionaryEnable } from './getDictionaryEnable';

/**
 * グローバル辞書取得
 * @param db drizzle
 * @returns
 */
export async function getGlobalDictionaries(db: SchemaDB, userId: string) {
	const results = await db.query.dictionary.findMany({
		where: and(eq(dictionary.parentId, 'global')),
	});
	return await Promise.all(
		results.map(async (x) => {
			let enableData = await geDictionaryEnable(db, x.id, userId);

			if (!enableData) {
				enableData = await createDictionaryEnable(db, {
					dictionaryId: x.id,
					disabled: false,
					userId: userId,
				});
			}

			return {
				...x,
				enable: !enableData.disabled,
			};
		}),
	);
}
