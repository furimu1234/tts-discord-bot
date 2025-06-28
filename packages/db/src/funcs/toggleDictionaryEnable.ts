import { type InferInsertModel, and, eq } from 'drizzle-orm';
import { type SchemaDB, dictionaryEnable } from '../';
type updateDictionary = Pick<
	InferInsertModel<typeof dictionaryEnable>,
	'dictionaryId' | 'userId'
>;

/**
 * 辞書を更新する
 * @param db drizzle
 * @param values
 * @returns
 */
export async function toggleDictionaryEnable(
	db: SchemaDB,
	values: updateDictionary,
) {
	const findOne = await db.query.dictionaryEnable.findFirst({
		where: and(
			eq(dictionaryEnable.userId, values.userId),
			eq(dictionaryEnable.dictionaryId, values.dictionaryId),
		),
	});

	let effects: { dictionaryId: number; userId: string; enable: boolean }[] = [];

	if (!findOne) {
		effects = await db
			.insert(dictionaryEnable)
			.values({
				dictionaryId: values.dictionaryId,
				userId: values.userId,
				disabled: true,
			})
			.returning({
				dictionaryId: dictionaryEnable.dictionaryId,
				userId: dictionaryEnable.userId,
				enable: dictionaryEnable.disabled,
			});
	} else {
		effects = await db
			.update(dictionaryEnable)
			.set({
				disabled: !findOne.disabled,
			})
			.where(
				and(
					eq(dictionaryEnable.userId, values.userId),
					eq(dictionaryEnable.dictionaryId, values.dictionaryId),
				),
			)
			.returning({
				dictionaryId: dictionaryEnable.dictionaryId,
				userId: dictionaryEnable.userId,
				enable: dictionaryEnable.disabled,
			});
	}

	if (effects.length === 0) return undefined;
	console.log(effects);

	return effects[0];
}
