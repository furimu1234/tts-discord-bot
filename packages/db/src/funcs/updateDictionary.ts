import { type InferInsertModel, eq, or } from 'drizzle-orm';
import { type SchemaDB, dictionary } from '../';
type updateDictionary = Partial<
	Pick<
		InferInsertModel<typeof dictionary>,
		'beforeWord' | 'afterWord' | 'parentId' | 'createrId' | 'id'
	>
>;

/**
 * 辞書を更新する
 * @param db drizzle
 * @param values
 * @returns
 */
export async function updateDictionary(db: SchemaDB, values: updateDictionary) {
	const effects = await db
		.update(dictionary)
		.set(values)
		.where(
			or(
				values.parentId ? eq(dictionary.parentId, values.parentId) : undefined,
				values.id ? eq(dictionary.id, values.id) : undefined,
			),
		)
		.returning();

	if (effects.length === 0) return undefined;

	return effects[0];
}
