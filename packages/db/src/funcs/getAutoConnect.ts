import { and, eq } from 'drizzle-orm';
import type { SchemaDB } from '../client';
import { autoConnect } from '../schema';

/**
 * 自動接続の設定を取得する
 * @param db drizzle
 * @param voiceId 自動接続をするVCID
 * @param textId 読み上げをするTCID
 * @returns model
 */
export const getAutoConnect = async (
	db: SchemaDB,
	voiceId: string,
	textId?: string,
) => {
	return await db.query.autoConnect.findFirst({
		where: and(
			eq(autoConnect.voiceId, voiceId),
			textId !== undefined ? eq(autoConnect.textId, textId) : undefined,
		),
	});
};

/**
 * サーバー内の自動設定を取得する
 * @param db drizzle
 * @param guildId 自動設定を取得するサーバーのID
 * @returns model[]
 */
export const getAutoConnects = async (db: SchemaDB, guildId: string) => {
	return await db.query.autoConnect.findMany({
		where: and(eq(autoConnect.guildId, guildId)),
	});
};
