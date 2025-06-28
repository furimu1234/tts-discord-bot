import { and, eq } from 'drizzle-orm';
import { type SchemaDB, dictionaryEnable } from '..';

export async function geDictionaryEnable(
	db: SchemaDB,
	dictionaryId: number,
	userId: string,
) {
	return await db.query.dictionaryEnable.findFirst({
		where: and(
			eq(dictionaryEnable.dictionaryId, dictionaryId),
			eq(dictionaryEnable.userId, userId),
		),
	});
}
