import { z } from 'zod';

export const emotions = [
	'happiness',
	'anger',
	'sadness',
	'ノーマル',
	'あまあま',
	'ツンツン',
	'セクシー',
	'ささやき',
	'ヒソヒソ',
	'ヘロヘロ',
	'なみだめ',
	'クイーン',
	'喜び',
	'ツンギレ',
	'悲しみ',
	'ふつう',
	'わーい',
	'びくびく',
	'おこ',
	'びえーん',
	'熱血',
	'不機嫌',
	'しっとり',
	'かなしみ',
	'囁き',
	'セクシー／あん子',
	'泣き',
	'怒り',
	'のんびり',
	'たのしい',
	'かなしい',
	'人間ver.',
	'ぬいぐるみver.',
	'人間（怒り）ver.',
	'鬼ver.',
	'アナウンス',
	'読み聞かせ',
	'第二形態',
	'ロリ',
	'楽々',
	'恐怖',
	'内緒話',
	'おちつき',
	'うきうき',
	'人見知り',
	'おどろき',
	'こわがり',
	'へろへろ',
	'元気',
	'ぶりっ子',
	'ボーイ',
	'低血圧',
	'覚醒',
	'実況風',
	'おどおど',
	'絶望と敗北',
] as const;

export const emotion = z.enum(emotions);
export type emotion = z.infer<typeof emotion>;

export const defaultVoiceEmotions = ['happiness', 'anger', 'sadness'] as const;
export const defaultVoiceEmotion = z.enum(defaultVoiceEmotions);
export type defaultVoiceEmotion = z.infer<typeof defaultVoiceEmotion>;

export const defaultVoiceSpeakers = [
	'show',
	'haruka',
	'hikari',
	'takeru',
	'santa',
	'bear',
] as const;

export type DefaultSpeakers = (typeof defaultVoiceSpeakers)[number];
export const defaultVoiceSpeakerSchema = z.enum(defaultVoiceSpeakers);
export type DefaultVoiceSpeaker = z.infer<typeof defaultVoiceSpeakerSchema>;

export const speakers = [
	...defaultVoiceSpeakers,

	'四国めたん',
	'ずんだもん',
	'春日部つむぎ',
	'雨晴はう',
	'波音リツ',
	'玄野武宏',
	'白上虎太郎',
	'青山龍星',
	'冥鳴ひまり',
	'九州そら',
	'もち子さん',
	'剣崎雌雄',
	'WhiteCUL',
	'後鬼',
	'No.7',
	'ちび式じい',
	'櫻歌ミコ',
	'小夜/SAYO',
	'ナースロボ＿タイプＴ',
	'†聖騎士 紅桜†',
	'雀松朱司',
	'麒ヶ島宗麟',
	'春歌ナナ',
	'猫使アル',
	'猫使ビィ',
	'中国うさぎ',
	'栗田まろん',
	'あいえるたん',
	'満別花丸',
	'琴詠ニア',
	'Voidoll',
	'ぞん子',
	'中部つるぎ',
] as const;
export const speaker = z.enum(speakers);
export type speaker = z.infer<typeof speaker>;

export const toJpSpeaker = (speaker: DefaultVoiceSpeaker) => {
	switch (speaker) {
		case 'show':
			return '男性1';

		case 'takeru':
			return '男性2';
		case 'haruka':
			return '女性1';
		case 'hikari':
			return '女性2';
		case 'bear':
			return '熊';
		case 'santa':
			return 'サンタ';
	}
};
