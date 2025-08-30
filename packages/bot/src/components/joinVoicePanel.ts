import type { getGuildInfo } from '@tts/db';
import {
	ButtonStyle,
	type ClientUser,
	ContainerBuilder,
	type VoiceBasedChannel,
} from 'discord.js';
import {
	addSectionWithButtonBuilder,
	addSeparatorBuilder,
	addTextDisplayBuilder,
} from './lib';

type guildInfoOption = Awaited<ReturnType<typeof getGuildInfo>>[number];

export const createjoinVoicePanelComponent = (
	clientUser: ClientUser,
	voiceChannel: VoiceBasedChannel,
	guildInfoOption: guildInfoOption,
) => {
	return new ContainerBuilder()
		.addSectionComponents(
			addSectionWithButtonBuilder({
				contents: [`# ${voiceChannel.name}で読み上げを開始します`],
				buttonLabel: '読み上げ音声設定',
				buttonCustomId: 'setting_voice',
				buttonStyle: ButtonStyle.Primary,
			}),
		)
		.addSeparatorComponents(addSeparatorBuilder())
		.addTextDisplayComponents(
			addTextDisplayBuilder(
				`# サーバ設定\n- 読み上げ文字数: ${guildInfoOption.textLength}`,
			),
		)
		.addSectionComponents(
			addSectionWithButtonBuilder({
				contents: [
					`# ${voiceChannel.name}の設定(読み上げ終了すると初期化されます)`,
				],
				buttonLabel:
					'自動再接続\n- バグ修正などでBOTが再起動したときに自動接続します。',
				buttonCustomId: `toggle_auto_connect:${voiceChannel.id}`,
				buttonStyle: ButtonStyle.Success,
			}),
		)
		.addSeparatorComponents(addSeparatorBuilder())
		.addTextDisplayComponents(
			addTextDisplayBuilder(`-# by ${clientUser.displayName}`),
		);
};
