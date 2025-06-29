import { type InferInsertModel, eq, or } from 'drizzle-orm';
import { type SchemaDB, guildInfo } from '../';

/**更新情報 */
type updateGuildInfo = Partial<
	Pick<InferInsertModel<typeof guildInfo>, 'guildId' | 'textLength' | 'id'>
>;

/**
 * サーバー設定を更新する
 * @param db drizzle
 * @param values 更新情報
 * @returns
 */
export async function updateGuildInfo(db: SchemaDB, values: updateGuildInfo) {
	const effects = await db
		.update(guildInfo)
		.set({ textLength: values.textLength })
		.where(
			or(
				values.guildId ? eq(guildInfo.guildId, values.guildId) : undefined,
				values.id ? eq(guildInfo.id, values.id) : undefined,
			),
		)
		.returning();

	if (effects.length === 0) return undefined;

	return effects[0];
}
