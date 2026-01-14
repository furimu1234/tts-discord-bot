import { type GetVoiceInfo, getEmotions, type SchemaDB } from '@tts/db';
import {
	defaultVoiceSpeakers,
	speakers,
	toJpSpeaker,
} from '@tts/db/dist/handmeid';
import {
	vtEmotionLevelSchema,
	vtPitchSchema,
	vvIntnationSchema,
	vvPitchSchema,
} from '@tts/lib';
import {
	ActionRowBuilder,
	ButtonStyle,
	ContainerBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from 'discord.js';
import { custom } from 'zod';
import {
	addSectionWithButtonBuilder,
	addSeparatorBuilder,
	addTextDisplay,
	addTextDisplayBuilder,
} from './shared';

export const makeVoiceInfoComponent = async (
	db: SchemaDB,
	voiceInfoModel: GetVoiceInfo,
) => {
	const container = new ContainerBuilder();
	container.addTextDisplayComponents(addTextDisplay('# 読み上げ音声設定'));
	container.addSeparatorComponents(addSeparatorBuilder());

	if (!voiceInfoModel.sub || !voiceInfoModel.master) return container;

	const currentEngineLabel = voiceInfoModel.main.useVv
		? 'VOICEVOX'
		: 'VoiceText Web API';

	container.addSectionComponents(
		addSectionWithButtonBuilder({
			contents: [
				'# ボイスエンジン（読み上げ方式）',
				`現在：**${currentEngineLabel}**`,
				'切替先：' +
					(voiceInfoModel.main.useVv ? 'VoiceText Web API' : 'VOICEVOX'),
				'',
				'- VOICEVOX',
				'- VoiceText Web API',
			],
			buttonCustomId: 'toggle_use_vv',
			buttonLabel: 'ボイスエンジン変更',
			buttonStyle: ButtonStyle.Success,
		}),
	);

	container.addTextDisplayComponents(
		addTextDisplay('# 話者設定\n下のセレクトメニューから選んでね!'),
	);

	if (voiceInfoModel.main.useVv) {
		//VV用の話者選択メニュー
		const optionChunks = makeVOICEVOXOptionsChunks(
			voiceInfoModel.master.speaker,
		);

		makeSelectRow(optionChunks, 'select-vv-speaker-:index').forEach((row) => {
			container.addActionRowComponents(row);
		});

		//---------------------
		container.addSeparatorComponents(addSeparatorBuilder());
		//感情選択メニュー
		container.addTextDisplayComponents(
			addTextDisplay(
				'# 感情設定\n下のセレクトメニューから選んでね!\n話者が変わると感情もリセットされるよ!',
			),
		);

		const emotionOptions = await getEmotions(
			db,
			voiceInfoModel.master.speaker,
		).then((masters) => {
			return masters.map((master) => {
				return new StringSelectMenuOptionBuilder()
					.setValue(master.emotion)
					.setLabel(master.emotion)
					.setDefault(master.emotion === voiceInfoModel.master?.emotion);
			});
		});

		makeSelectRow([emotionOptions], 'select-vv-emotion-:index').forEach(
			(row) => {
				container.addActionRowComponents(row);
			},
		);
	} else {
		//VT用の話者選択メニューを作成
		const optionChunks = makeVTOptionsChunks(voiceInfoModel.master.speaker);

		makeSelectRow(optionChunks, 'select-vt-speaker').forEach((row) => {
			container.addActionRowComponents(row);
		});

		//---------------------
		container.addSeparatorComponents(addSeparatorBuilder());

		//VT用の感情選択メニューを作成
		//2026.01時点ではVVとやってることは同じ
		container.addTextDisplayComponents(
			addTextDisplay(
				'# 感情設定\n下のセレクトメニューから選んでね!\n話者が変わると感情もリセットされるよ!',
			),
		);

		const emotionOptions = await getEmotions(
			db,
			voiceInfoModel.master.speaker,
		).then((masters) => {
			return masters.map((master) => {
				return new StringSelectMenuOptionBuilder()
					.setValue(master.emotion)
					.setLabel(master.emotion)
					.setDefault(master.emotion === voiceInfoModel.master?.emotion);
			});
		});

		makeSelectRow([emotionOptions], 'select-vt-emotion').forEach((row) => {
			container.addActionRowComponents(row);
		});
	}

	container.addSeparatorComponents(addSeparatorBuilder());

	//VT用感情レベル設定

	if ('emotionLevel' in voiceInfoModel.sub) {
		container.addTextDisplayComponents(
			addTextDisplayBuilder(
				'# 感情レベル設定\n下のセレクトメニューから選んでね!',
			),
		);
		const emotionLevel = voiceInfoModel.sub.emotionLevel;

		// container.addSectionComponents(
		// 	addSectionWithButtonBuilder({
		// 		contents: [
		// 			'# 感情レベル設定',
		// 			`感情レベル: ${voiceInfoModel.sub.emotionLevel}`,
		// 		],
		// 		buttonCustomId: 'edit_emotion_lvl',
		// 		buttonLabel: '感情レベル変更',
		// 		buttonStyle: ButtonStyle.Success,
		// 	}),
		// );

		const emotionLevelOptions = makeRange(
			vtEmotionLevelSchema.minValue,
			vtEmotionLevelSchema.maxValue,
			1,
		).map((value) => {
			return new StringSelectMenuOptionBuilder()
				.setLabel(value.toString())
				.setValue(value.toString())
				.setDefault(value === emotionLevel);
		});
		makeSelectRow([emotionLevelOptions], 'select-vt-emotionlevel').forEach(
			(row) => {
				container.addActionRowComponents(row);
			},
		);
	} else {
		const intnation = voiceInfoModel.sub.intnation;

		container.addTextDisplayComponents(
			addTextDisplayBuilder(
				'# イントネーション設定\n下のセレクトメニューから選んでね!',
			),
		);

		const intnationOptions = makeRange(
			vvIntnationSchema.minValue,
			vvIntnationSchema.maxValue,
			0.5,
		).map((value) => {
			return new StringSelectMenuOptionBuilder()
				.setLabel(value.toString())
				.setValue(value.toString())
				.setDefault(value === intnation);
		});

		makeSelectRow([intnationOptions], 'select-intnation').forEach((row) => {
			container.addActionRowComponents(row);
		});

		// container.addSectionComponents(
		// 	addSectionWithButtonBuilder({
		// 		contents: [
		// 			'# イントネーション設定',
		// 			`イントネーション: ${voiceInfoModel.sub.intnation}`,
		// 		],
		// 		buttonCustomId: 'edit_intnation',
		// 		buttonLabel: 'イントネーション変更',
		// 		buttonStyle: ButtonStyle.Success,
		// 	}),
		// );
	}
	container.addSeparatorComponents(addSeparatorBuilder());
	// container.addSectionComponents(
	// 	addSectionWithButtonBuilder({
	// 		contents: ['# 音程設定', `音程: ${voiceInfoModel.sub.pitch}`],
	// 		buttonCustomId: 'edit_pitch',
	// 		buttonLabel: '音程変更',
	// 		buttonStyle: ButtonStyle.Success,
	// 	}),
	// );

	container.addTextDisplayComponents(
		addTextDisplayBuilder('# 音程設定\n下のセレクトメニューから選んでね!'),
	);

	let pitchOption: StringSelectMenuOptionBuilder[] = [];
	const pitch = voiceInfoModel.sub.pitch;

	if (voiceInfoModel.main.useVv) {
		pitchOption = makeRange(
			vvPitchSchema.minValue,
			vvPitchSchema.maxValue,
			0.05,
		).map((value) => {
			return new StringSelectMenuOptionBuilder()
				.setLabel(value.toString())
				.setValue(value.toString())
				.setDefault(value === pitch);
		});
	} else {
		pitchOption = makeRange(
			vtPitchSchema.minValue,
			vtPitchSchema.maxValue,
			50,
		).map((value) => {
			return new StringSelectMenuOptionBuilder()
				.setLabel(value.toString())
				.setValue(value.toString())
				.setDefault(value === pitch);
		});
	}

	makeSelectRow([pitchOption], 'select-pitch').forEach((row) => {
		container.addActionRowComponents(row);
	});

	return container;
};

export const chunk = <T>(arr: T[], size: number): T[][] => {
	const out: T[][] = [];
	for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
	return out;
};

const makeVOICEVOXOptionsChunks = (nowSpeaker?: string) => {
	const options = speakers.flatMap((s) => {
		//@ts-expect-error
		if (defaultVoiceSpeakers.includes(s)) return [];

		return [
			new StringSelectMenuOptionBuilder()
				.setValue(s)
				.setLabel(s)
				.setDefault(nowSpeaker === s),
		];
	});

	const optionChunks = chunk(options, 25);

	return optionChunks;
};

const makeVTOptionsChunks = (nowSpeaker?: string) => {
	const options = defaultVoiceSpeakers.flatMap((s) => {
		return [
			new StringSelectMenuOptionBuilder()
				.setValue(s)
				.setLabel(toJpSpeaker(s))
				.setDefault(nowSpeaker === s),
		];
	});

	const optionChunks = chunk(options, 25);

	return optionChunks;
};

//オプションチャンク毎に分割したrowを作成する。
export const makeSelectRow = (
	optionChunks: StringSelectMenuOptionBuilder[][],
	customId: string,
): ActionRowBuilder<StringSelectMenuBuilder>[] => {
	return optionChunks.map((opts, index) => {
		const select = new StringSelectMenuBuilder()
			.setCustomId(`${customId}`.replace(':index', index.toString()))
			.addOptions(opts);

		return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			select,
		);
	});
};

export function makeRange(
	min: number | null,
	max: number | null,
	step: number,
) {
	if (min === null || max === null) return [];

	const decimals = (() => {
		const s = String(step);
		const i = s.indexOf('.');
		return i >= 0 ? s.length - i - 1 : 0;
	})();
	const round = (n: number) => Number(n.toFixed(decimals));

	const out: number[] = [];
	for (let v = min; v <= max + step / 2; v += step) {
		out.push(round(v));
	}
	return out;
}
