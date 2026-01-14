import { eq } from 'drizzle-orm';
import type { SchemaDB } from '../client';
import { autoConnect } from '../schema';

/**
 * 自動接続の設定を削除する
 * @param db drizzle
 * @param voiceId 自動接続をするVCID
 * @returns boolean
 */
export const deleteAutoConnect = async (db: SchemaDB, voiceId: string) => {
	return await db.delete(autoConnect).where(eq(autoConnect.voiceId, voiceId));
};
