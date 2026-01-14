import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	channelMention,
	type GuildMember,
	type SendableChannels,
} from 'discord.js';
import {
	addSectionWithButtonBuilder,
	addSeparatorBuilder,
	addTextDisplay,
} from './shared';

export const makeMenuComponent = async (
	member: GuildMember,
	ttsChannel?: SendableChannels,
) => {
	const channelId = member.voice.channelId;
	const channelToString =
		channelId !== null ? channelMention(channelId) : '接続したVC';
	const container = new ContainerBuilder();

	let title = '# 読み上げメニュー\n';
	if (ttsChannel) {
		title += `## ${channelMention(ttsChannel.id)}に送信したメッセージを読み上げます`;
	}

	container.addTextDisplayComponents(addTextDisplay(title));
	container.addSeparatorComponents(addSeparatorBuilder());

	container.addSectionComponents(
		addSection(
			`# ①読み上げ開始\n${channelToString}で読み上げを開始します。VCに接続してからボタンを押してください。`,
			'①',
			'start_tts',
		),
	);
	container.addSeparatorComponents(addSeparatorBuilder());

	container.addSectionComponents(
		addSection(
			`# ②読み上げ終了\n${channelToString}で読み上げを終了します。VCに接続してからボタンを押してください。`,
			'②',
			'end_tts',
			ButtonStyle.Success,
		),
	);
	container.addSeparatorComponents(addSeparatorBuilder());

	container.addSectionComponents(
		addSection(
			`# ③読み上げ音声設定\nボタンを押した人の読み上げ音声設定メニューを表示します。`,
			'③',
			'show_tts_menu',
		),
	);
	container.addSeparatorComponents(addSeparatorBuilder());

	container.addTextDisplayComponents(
		addTextDisplay('# ④辞書設定\n特定の単語の読みを別の読み方に変更します'),
	);
	container.addSeparatorComponents(addSeparatorBuilder());
	container.addTextDisplayComponents(
		addTextDisplay(
			'④-① 辞書追加・更新: 辞書を追加し単語の読み方を変更します\n`既に読み方が登録されてる場合は読み方を変更します`\n④‐② 辞書削除: 辞書を削除し単語を元の読み方に戻します\n④‐③ 辞書一覧: 辞書の一覧を表示します',
		),
	);

	const addDict = new ButtonBuilder()
		.setLabel('④-①')
		.setCustomId('add_dict')
		.setStyle(ButtonStyle.Primary);
	const remDict = new ButtonBuilder()
		.setLabel('④-②')
		.setCustomId('rem_dict')
		.setStyle(ButtonStyle.Primary);

	const listDict = new ButtonBuilder()
		.setLabel('④-③')
		.setCustomId('list_dict')
		.setStyle(ButtonStyle.Primary);

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
		addDict,
		remDict,
		listDict,
	);
	container.addActionRowComponents(row);

	container.addSeparatorComponents(addSeparatorBuilder());

	container.addTextDisplayComponents(
		addTextDisplay(
			'# ⑤自動接続設定\n指定したVCに誰かが接続したら紐づいたTCのチャットを読み上げるために自動接続をします\n',
		),
	);
	container.addSeparatorComponents(addSeparatorBuilder());

	container.addTextDisplayComponents(
		addTextDisplay(
			'⑤-① 自動接続追加・更新: 自動接続するVCを追加・読み上げTCを変更します\n⑤‐② 自動接続削除: 自動接続するVCを削除します\n⑤‐③ 自動接続一覧: 自動接続一覧を表示します',
		),
	);

	const addAutoConnect = new ButtonBuilder()
		.setLabel('⑤-①')
		.setCustomId('add_autoconnect')
		.setStyle(ButtonStyle.Primary);
	const remAutoConnect = new ButtonBuilder()
		.setLabel('⑤-②')
		.setCustomId('rem_autoconnect')
		.setStyle(ButtonStyle.Primary);
	const listAutoConnect = new ButtonBuilder()
		.setLabel('⑤-③')
		.setCustomId('list_autoconnect')
		.setStyle(ButtonStyle.Primary);

	const autoConnectRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		addAutoConnect,
		remAutoConnect,
		listAutoConnect,
	);
	container.addActionRowComponents(autoConnectRow);

	container.addSeparatorComponents(addSeparatorBuilder());

	return container;
};

const addSection = (
	content: string,
	buttonLabel: string,
	buttonCustomId: string,
	buttonStyle: ButtonStyle = ButtonStyle.Success,
	buttonDisable: boolean = false,
) => {
	return addSectionWithButtonBuilder({
		contents: content.split('\n'),
		buttonLabel,
		buttonCustomId,
		buttonStyle,
		buttonDisable,
	});
};
