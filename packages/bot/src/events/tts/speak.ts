import { getVoiceConnection } from '@discordjs/voice';
import {
	createVoiceInfo,
	type DefaultSpeakers,
	getDictionaries,
	getMasterBySpeakerId,
	getVoiceInfo,
} from '@tts/db';
import { Player, wrapSendError } from '@tts/lib';
import { Events, type Message } from 'discord.js';
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
	if (member.user.bot) return;
	if (!member.voice.channel) return;

	const voiceState = guild.voiceStates.cache.find(
		(vs) => vs.channelId === member.voice.channel?.id,
	);

	if (!voiceState) return;

	const dictionaries = await store.do(async (db) => {
		return await getDictionaries(db, guild.id);
	});

	const replaced = await replaceClient.runAllFromMessage(message, dictionaries);

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
		const query = await engine.createAudioQuery(model.sub.speakerId, replaced);

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
			text: replaced,
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
