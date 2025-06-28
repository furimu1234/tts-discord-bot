import { z } from 'zod';

export interface BaseVoiceParam {
	text: string;
	speaker: number;
}

/**モーラスキーマ */
export const MoraSchema = z.object({
	text: z.string(),
	consonant: z.string(),
	consonant_length: z.number(),
	vowel: z.string(),
	vowel_length: z.number(),
	pitch: z.number().min(-0.15).max(0.15),
});
/**モーラ */
export type IMora = z.infer<typeof MoraSchema>;

/**アクセント句スキーマ */
export const AccentPhrasesSchema = z.object({
	/**モーラリスト */
	moras: MoraSchema.array(),
	/**アクセントの場所 */
	accent: z.number(),
	/**後ろに無音を付けるかどうか */
	pause_mora: MoraSchema,
	/**疑問系かどうか */
	is_interrogative: z.boolean(),
});
/**アクセント句データ */
export type IAccentPhrasesSchema = z.infer<typeof AccentPhrasesSchema>;

/**オーディオクエリスキーマ */
export const AudioQuerySchema = z.object({
	/**アクセント句のリスト */
	accent_phrases: AccentPhrasesSchema.array(), // 詳細な型が必要なら拡張可能
	/**スピード */
	speedScale: z.number().min(0.5).max(2.0),
	/**音程 */
	pitchScale: z.number().min(-0.15).max(0.15),
	/**イントネーション */
	intonationScale: z.number().min(0).max(2.0),
	/**音量 */
	volumeScale: z.number().min(0).max(2.0),
	/**再生前の無音時間 */
	prePhonemeLength: z.number().min(0),
	/**再生後の無音時間 */
	postPhonemeLength: z.number().min(0),
	/**句読点などの無音時間 */
	pauseLength: z.number().min(0).nullable(),
	/**句読点などの無音時間(倍率) */
	pauseLengthScale: z.number().min(0),
	/**音声データのサンプリングレート */
	outputSamplingRate: z.number().int(), // 整数限定
	/**音声データをステレオ出力するか */
	outputStereo: z.boolean(),
	/**AquesTalk風紀法によるテキスト */
	kana: z.string().optional().readonly(), // 読み取り専用フィールド
});

/**オーディオクエリデータ */
export type IAudioQuery = z.infer<typeof AudioQuerySchema>;
