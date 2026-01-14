import { messageID, SendError } from '@tts/lib';
import type { SchemaDB } from '../client';
import { autoConnect } from '../schema';

/**
 * 自動接続設定を登録する
 * @param db drizzle
 * @param guildId 自動接続を登録するサーバーID
 * @param voiceId 自動接続を登録するVCID
 * @param textId 自動接続時読み上げるテキストチャンネルのID
 * @return record id
 */
export const createAutoConnect = async (
	db: SchemaDB,
	guildId: string,
	voiceId: string,
	textId: string,
) => {
	const models = await db
		.insert(autoConnect)
		.values({ guildId, voiceId, textId })
		.returning({ id: autoConnect.id });

	if (models.length !== 1) throw new SendError(messageID.E00001(), false);

	return models[0].id;
};
