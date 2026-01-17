import { getVoiceConnection } from '@discordjs/voice';
import {
	createVoiceInfo,
	type DefaultSpeakers,
	getMasterBySpeakerId,
	getVoiceInfo,
} from '@tts/db';
import { Player, wrapSendError } from '@tts/lib';
import {
	Events,
	type Guild,
	type GuildMember,
	type VoiceBasedChannel,
	type VoiceState,
} from 'discord.js';
import { container } from '../../container';
import { createInitVoiceInfo } from '../../utils/voiceInfo';

export const name = Events.VoiceStateUpdate;
export const once = false;
export async function execute(before: VoiceState, after: VoiceState) {
	await wrapSendError(
		{ ephemeral: false, channel: undefined },
		async () => await main(before, after),
	);
}

export const main = async (before: VoiceState, after: VoiceState) => {
	if (before.channel && after.channel && before.channel.id === after.channel.id)
		return;
	if (!container.current) return;
	const store = container.current.getDataStore();

	let guild: Guild;
	let member: GuildMember | null;
	let text: string = '';
	let voiceChannel: VoiceBasedChannel;

	if (before.channel) {
		guild = before.guild;
		voiceChannel = before.channel;

		if (!guild) return;

		if (!before.channel?.isSendable()) return;

		member = before.member;
		text = `${member?.displayName}が退出しました`;
	} else if (after.channel) {
		guild = after.guild;
		voiceChannel = after.channel;

		if (!guild) return;

		if (!after.channel?.isSendable()) return;

		member = after.member;
		text = `${member?.displayName}が入室しました`;
	} else return;

	if (!member) return;
	if (member.user.bot) return;

	const voiceState = guild.voiceStates.cache.find(
		(vs) => vs.channelId === voiceChannel.id,
	);

	if (!voiceState) return;
	const model = await store.do(async (db) => {
		const model = await getVoiceInfo(db, member.id);

		if (!model) {
			const voiceInfo = createInitVoiceInfo();

			await createVoiceInfo(db, member.id, voiceInfo);
		}
		if (!!model && !!model.main && !model.sub) {
			const voiceInfo = createInitVoiceInfo({ useVv: model.main.useVv });

			await createVoiceInfo(db, member.id, voiceInfo);
		}
		return await getVoiceInfo(db, member.id);
	});
	if (!model) return;

	const connection = await getVoiceConnection(
		guild.id,
		voiceState.client.user.id,
	);

	if (!connection) return;

	if (model.main.useVv && model.sub?.speakerId) {
		const engine = container.current.getVoiceVoxClient();
		const query = await engine.createAudioQuery(model.sub.speakerId, text);

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
			text,
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
	} else {
		console.log('model subが見つかりません(謎のエラー');
	}
};
