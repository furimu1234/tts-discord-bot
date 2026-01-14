import type { Readable } from 'node:stream';
// player.ts
import {
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	entersState,
	NoSubscriberBehavior,
	StreamType,
	type VoiceConnection,
	VoiceConnectionStatus,
} from '@discordjs/voice';

export const Player = (connection: VoiceConnection) => {
	// プレイヤ生成＆購読（重要）
	const player = createAudioPlayer({
		behaviors: { noSubscriber: NoSubscriberBehavior.Play },
	});
	connection.subscribe(player);

	const ensureReady = async () => {
		await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
	};

	const play = async (func: () => Promise<Readable>) => {
		await ensureReady();
		const stream = await func();

		// Ogg を demuxProbe で判別して AudioResource 化
		const resource = createAudioResource(stream, {
			inputType: StreamType.Arbitrary,
		});

		player.play(resource);

		// 再生開始（短尺対策で Idle との race）
		await Promise.race([
			entersState(player, AudioPlayerStatus.Playing, 10_000),
			entersState(player, AudioPlayerStatus.Idle, 10_000),
		]).catch((e) => console.error('[player] not playing', e));

		// 再生終了まで待機（任意）
		await entersState(player, AudioPlayerStatus.Idle, 120_000).catch(() => {});
	};

	return { play, player };
};
