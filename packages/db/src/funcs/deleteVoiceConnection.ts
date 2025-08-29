import { type InferSelectModel, eq, or } from 'drizzle-orm';
import { type SchemaDB, voiceConnection } from '../';

/**削除フィルター */
type deleteVoiceConnection = Partial<
	Pick<InferSelectModel<typeof voiceConnection>, 'textId' | 'voiceId'>
>;

/**
 * 接続してるVC情報を削除する
 * @param db drizzle
 * @param values 更新情報
 * @returns
 */
export async function deleteVoiceConnection(
	db: SchemaDB,
	filter: deleteVoiceConnection,
) {
	const effects = await db
		.delete(voiceConnection)

		.where(
			or(
				filter.textId ? eq(voiceConnection.textId, filter.textId) : undefined,
				filter.voiceId
					? eq(voiceConnection.voiceId, filter.voiceId)
					: undefined,
			),
		)
		.returning();

	if (effects.length === 0) return undefined;

	return effects[0];
}
