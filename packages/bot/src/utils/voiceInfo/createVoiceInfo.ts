import type { InitVoiceInfoData } from '@tts/db';
import {
	getRandomDoubleInRange,
	getRandomInRange,
	getRandomSpeakerId,
} from '@tts/lib';

/**VoiceInfoを作成する */
export const createInitVoiceInfo = (options?: {
	useVv?: boolean;
}): InitVoiceInfoData => {
	let voiceType = getRandomInRange(0, 1);

	//ボイスエンジンの指定があればそれに従う
	if (options) {
		if ('useVv' in options) {
			voiceType = options.useVv === true ? 1 : 0;
		}
	}

	let speakerId = getRandomSpeakerId();
	//イントネーション
	let emotionLevel = getRandomDoubleInRange(0.0, 2.0);
	let pitch = getRandomDoubleInRange(-0.15, 0.15);
	let speed = 1.0;

	if (voiceType === 0) {
		speakerId = getRandomSpeakerId(17) + 500;
		emotionLevel = getRandomInRange(1, 4);
		pitch = getRandomInRange(50, 100);
		speed = 100;
	}

	return { speakerId, emotionLevel, pitch, speed };
};
