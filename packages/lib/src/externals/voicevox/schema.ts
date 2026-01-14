import z from 'zod';

//モーラ(ナニコレ？)
const moraSchema = z.object({
	//テキスト
	text: z.string(),
	//子音の音素
	consonant: z.string().nullable(),
	//子音の長さ
	consonant_length: z.number().nullable(),
	// 母音の音素
	vowel: z.string(),
	//母音の長さ
	vowel_length: z.number(),
	//ピッチ
	pitch: z.number(),
});

// アクセント句
const accentPhrases = z.object({
	//モーラのリスト
	moras: moraSchema.array(),
	//アクセント箇所
	accent: z.number(),
	//アクセント句の末尾につく無音モーラ。nullの場合は無音モーラを付けない。
	pause_mora: moraSchema.nullable(),
	//疑問系かどうか
	is_interrogative: z.boolean(),
});

export const vvSpeedSchema = z.number().min(0.5).max(2);
export const vvPitchSchema = z.number().min(-0.15).max(0.15);
export const vvIntnationSchema = z.number().min(0).max(2);

export const audioQuerySchema = z.object({
	//アクセント句のリスト
	accent_phrases: accentPhrases.array(),
	// 速度
	speedScale: vvSpeedSchema,
	//ピッチ
	pitchScale: vvPitchSchema,
	// 抑揚
	intonationScale: vvIntnationSchema,
	// 音量(1固定)
	volumeScale: z.literal(1),
	//再生前の無音時間
	prePhonemeLength: z.literal(0.1),
	//再生後の無音時間
	postPhonemeLength: z.literal(0.1),
	//句読点などの無音時間
	pauseLength: z.literal(0.1).nullable(),
	//音声データの出力サンプリングレート
	outputSamplingRate: z.number(),
	// 音声データをステレオ出力するか否か
	outputStereo: z.boolean(),
	kana: z.string(),
});

export type AudioQuery = z.infer<typeof audioQuerySchema>;
