import type { InferInsertModel } from 'drizzle-orm';
import { dictionary, dictionaryEnable } from '../';
import type { SchemaDB } from '../client';

/**
 * 辞書作成
 * @param db drizzle
 * @param parentId parentId
 * @param createrId createrId
 * @param beforeWord 変換前単語
 * @param afterWord 変換後単語
 * @returns
 */
export async function createDictionary(
	db: SchemaDB,
	parentId: string,
	createrId: string,
	beforeWord: string,
	afterWord: string,
) {
	const results = await db
		.insert(dictionary)
		.values({
			parentId: parentId,
			createrId: createrId,
			beforeWord: beforeWord,
			afterWord: afterWord,
		})
		.returning();

	if (results.length === 0) throw new Error('');

	return results[0];
}

export async function createDictionaryEnable(
	db: SchemaDB,
	values: InferInsertModel<typeof dictionaryEnable>,
) {
	const effects = await db
		.insert(dictionaryEnable)
		.values({
			dictionaryId: values.dictionaryId,
			userId: values.userId,
			disabled: values.disabled,
		})
		.returning();

	return effects[0];
}
