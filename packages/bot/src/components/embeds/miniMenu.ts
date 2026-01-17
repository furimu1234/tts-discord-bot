import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';

export const makeMiniMenuComponent = () => {
	const embed = new EmbedBuilder()
		.setTitle('読み上げメニュー')
		.setDescription(
			'下のボタンを押してBOTの設定等を出来るよ!\n1️⃣ 読み上げ終了\n2️⃣ 読み上げ音声設定\n3️⃣ 辞書追加・更新\n4️⃣ 辞書削除\n5️⃣ 辞書一覧\n6️⃣ 自動接続追加・更新\n7️⃣ 自動接続削除\n8️⃣ 自動接続一覧',
		)
		.setFooter({ text: '読み上げ開始時の簡略メニューです' });
	embed.addFields({
		name: `読み上げ文字数`,
		value: '15文字を読み上げます!',
	});
	embed.addFields({
		name: '読み上げをブロック',
		value: '先頭に**;**を付けるとそのメッセージは読み上げなくなります',
	});

	const row0 = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setLabel('1️⃣')
			.setStyle(ButtonStyle.Success)
			.setCustomId('end_tts'),
		new ButtonBuilder()
			.setLabel('2️⃣')
			.setStyle(ButtonStyle.Success)
			.setCustomId('show_tts_menu'),
	);
	const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setLabel('3️⃣')
			.setStyle(ButtonStyle.Success)
			.setCustomId('add_dict'),
		new ButtonBuilder()
			.setLabel('4️⃣')
			.setStyle(ButtonStyle.Success)
			.setCustomId('rem_dict'),
		new ButtonBuilder()
			.setLabel('5️⃣')
			.setStyle(ButtonStyle.Success)
			.setCustomId('list_dict'),
	);
	const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setLabel('6️⃣')
			.setStyle(ButtonStyle.Success)
			.setCustomId('add_autoconnect'),
		new ButtonBuilder()
			.setLabel('7️⃣')
			.setStyle(ButtonStyle.Success)
			.setCustomId('rem_autoconnect'),
		new ButtonBuilder()
			.setLabel('8️⃣')
			.setStyle(ButtonStyle.Success)
			.setCustomId('list_autoconnect'),
	);

	return { embed, components: [row0, row1, row2] };
};
