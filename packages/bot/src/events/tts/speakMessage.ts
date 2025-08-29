import { getVoiceConnection } from '@discordjs/voice';
import {
	createVoiceSetting,
	deleteVoiceConnection,
	getDictionaries,
	getGlobalDictionaries,
	getVoiceSetting,
	getorCreateGuildInfoFindOne,
} from '@tts/db';
import { ChannelType, Events, type Message, channelMention } from 'discord.js';
import { botClient, container } from '../../container';
import {
	createVoiceConnection,
	fetchMember,
	sendErrorMessage,
} from '../../lib';

export const name = Events.MessageCreate;
export const once = false;

const ignoreMessages = ['読み上げ開始', '読み上げ終了', '読み上げ設定'];

/**
 * メッセージをVCでしゃべる
 */
export async function execute(message: Message): Promise<void> {
	if (!container.current || !botClient.user) return;

	const guild = message.guild;

	if (!guild) return;

	if (!message.channel.isSendable()) return;
	//除外文字列確認
	if (ignoreMessages.includes(message.content)) return;

	const me = guild.members.me ?? { id: '0' };

	if (message.author.id === me.id) return;

	const store = container.current.getDataStore();

	const member = await fetchMember(guild, {
		memberId: message.author.id,
	});

	if (!member) return;

	const guildInfo = await store.do(async (db) => {
		return await getorCreateGuildInfoFindOne(db, { guildId: guild.id });
	});

	const userVoiceChannel = member.voice.channel;

	if (!userVoiceChannel) {
		return;
	}

	const userVoiceChannelId = userVoiceChannel?.id ?? '0';

	const botVoiceChannelId = getVoiceConnection(guild.id, botClient.user.id)
		?.joinConfig.channelId;
	let botVoiceChannel = guild.channels.cache
		.filter((x) => x.type === ChannelType.GuildVoice)
		.get(botVoiceChannelId ?? '');

	//自動接続時に紐づいてるテキストチャンネルに再接続した旨のメッセージを送信する
	let autoConnectMessage = '';

	//BOT再起動時、もしくはBOTのconnectionがなくなった時
	if (!botVoiceChannel) {
		console.log(guildInfo);
		const voiceConnection = guildInfo.voiceConnections.find(
			(x) => x.textId === message.channelId && x.voiceId === userVoiceChannelId,
		);
		console.log(voiceConnection);

		if (!voiceConnection) return;

		//自動接続がオフの場合設定データを削除
		if (!voiceConnection.isAutoConnect) {
			await store.do(async (db) => {
				await deleteVoiceConnection(db, { voiceId: userVoiceChannel.id });
			});
			return;
		}

		botVoiceChannel = guild.channels.cache
			.filter((x) => x.type === ChannelType.GuildVoice)
			.get(voiceConnection.voiceId);

		autoConnectMessage += `${botVoiceChannel ?? '不明なチャンネル'}に自動接続しました。\n読み上げを停止する場合は、下のボタンもしくは\`読み上げ終了\`で読み上げを終了してください。\n`;
		autoConnectMessage += `- 読み上げVC: ${botVoiceChannel?.name ?? '不明なチャンネル'}\n- 読み上げTC: ${channelMention(message.channelId)}`;
	}

	if (!botVoiceChannel) return;

	//connection取得.未接続の場合は接続
	const connection = await createVoiceConnection(
		botClient,
		message,
		botVoiceChannel.id,
		true,
	);

	if (!connection) {
		sendErrorMessage(
			message.channel,
			'VCに接続できませんでした。時間をおいて再度実行してみてください。',
		);
		return;
	}
	//自動接続した場合その旨のメッセージを送信する
	if (autoConnectMessage.length !== 0) {
		await message.channel.send({
			content: autoConnectMessage,
		});
	}

	//話者など取得
	const { voiceSetting, dictionaries, globalDictionaries } = await store.do(
		async (db) => {
			let voiceSetting = await getVoiceSetting(db, message.author.id);

			if (!voiceSetting) {
				voiceSetting = await createVoiceSetting(db, message.author.id);
			}

			const dictionaries = await getDictionaries(db, { parentId: guild.id });
			const globalDictionaries = await getGlobalDictionaries(
				db,
				message.author.id,
			);

			return { voiceSetting, dictionaries, globalDictionaries };
		},
	);

	const player = container.current.getPlayer(connection);
	const vvClient = container.current.getVoiceVoxClient();
	const replace = container.current.getReplaceClient();

	const content = await replace.runAllFromMessage(
		message,
		dictionaries,
		globalDictionaries,
	);

	//音声再生
	await player.playFile(async () => {
		const query = await vvClient.createAudioQuery(
			voiceSetting.speakerId,
			content,
		);
		return await vvClient.synthesisToStream(voiceSetting.speakerId, query);
	});
}
