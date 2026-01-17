import { getVoiceConnection } from '@discordjs/voice';
import {
	createVoiceInfo,
	type DefaultSpeakers,
	getDictionaries,
	getMasterBySpeakerId,
	getVoiceInfo,
} from '@tts/db';
import {
	Player,
	PREFIX_BLOCK_SYMBOL,
	SLICE_LENGTH,
	wrapSendError,
} from '@tts/lib';
import { Events, type Message, type VoiceState } from 'discord.js';
import { container } from '../../container';
import { createInitVoiceInfo } from '../../utils/voiceInfo';

export const name = Events.MessageCreate;
export const once = false;
export async function execute(message: Message) {
	if (!message.channel?.isSendable()) return;

	await wrapSendError(
		{ ephemeral: false, channel: message.channel },
		async () => await main(message),
	);
}

export const main = async (message: Message) => {
	if (!container.current) return;
	const store = container.current.getDataStore();
	const replaceClient = container.current.getReplaceClient();

	const guild = message.guild;

	if (!guild) return;

	const messageChannel = message.channel;

	if (!messageChannel?.isSendable()) return;

	const member = message.member;
	if (!member) return;

	//読み上げブロックも含める
	const voiceState = getVoiceState(message);

	if (!voiceState) return;

	const dictionaries = await store.do(async (db) => {
		return await getDictionaries(db, guild.id);
	});

	const replaced = await replaceClient.runAllFromMessage(message, dictionaries);

	const sliced = replaced.slice(0, SLICE_LENGTH);

	const model = await store.do(async (db) => {
		const model = await getVoiceInfo(db, member.id);

		if (!model) {
			const voiceInfo = createInitVoiceInfo();

			await createVoiceInfo(db, member.id, voiceInfo);

			return await getVoiceInfo(db, member.id);
		}

		return model;
	});

	if (!model) return;

	const connection = await getVoiceConnection(
		guild.id,
		voiceState.client.user.id,
	);

	if (!connection) return;

	if (model.main.useVv && model.sub?.speakerId) {
		const engine = container.current.getVoiceVoxClient();
		const query = await engine.createAudioQuery(model.sub.speakerId, sliced);

		query.pitchScale = model.sub.pitch;
		query.speedScale = model.sub.speed;

		const result = await engine.synthesisToStream(model.sub.speakerId, query);
		const player = Player(connection);
		await player.play(async () => {
			return result;
		});
	} else if (model.sub && 'emotionLevel' in model.sub) {
		const engine = container.current.getVOICETEXTWebClient();

		const masterModel = await store.do(async (db) => {
			return await getMasterBySpeakerId(db, model.sub?.speakerId || 0);
		});

		if (!masterModel) return;

		const result = await engine.request({
			text: sliced,
			emotionLevel: model.sub.emotionLevel,
			pitch: model.sub.pitch,
			speed: model.sub.speed,
			speaker: masterModel.speaker as DefaultSpeakers,
			emotion: masterModel.emotion as 'happiness' | 'anger' | 'sadness',
			volume: 100,
		});

		const player = Player(connection);
		await player.play(async () => {
			return result.audio;
		});
	}
};

/**
 * ユーザが接続してるVCに接続してるBOTクライアントを取得する
 * @param message 送信されたメッセージ
 * @returns voicestate
 */
const getVoiceState = (message: Message): VoiceState | undefined => {
	if (!message.guild) return;
	const prefix = message.content[0];

	if (PREFIX_BLOCK_SYMBOL.includes(prefix)) return;
	if (message.author.bot) return;
	const member = message.member;

	if (!member) return;
	if (!member.voice.channel) return;

	return message.guild.voiceStates.cache.find(
		(vs) => vs.channelId === member.voice.channel?.id,
	);
};
