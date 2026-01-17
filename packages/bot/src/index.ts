import * as path from 'node:path';
import {
	createSpeakerEmotionMaster,
	type MasterType,
	schema,
	speaker,
} from '@tts/db';
import { type Client, Events } from 'discord.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { loadCommands } from './commands/main';
import { botClient, Container, container } from './container';
import { loadEvents } from './loadEvents';
import type { SpeakerType } from './types';
import { getEnv } from './utils/env';
import { slashCommandRegister } from './utils/registerCommands';

loadEvents(botClient, path.resolve(path.dirname(__filename), './events'));

// 最小の ready ログだけ
botClient.once(Events.ClientReady, async (c) => {
	console.log(`✅ Logged in as ${c.user.tag}`);

	const commands = await loadCommands();

	if (!botClient.user) return;

	console.log(
		'ロードコマンドリスト: ',
		commands.map((x) => `- ${x.name}`).join('\n'),
	);

	slashCommandRegister(botClient.user, commands);
});

// 起動に十分な最小構築
container.current = Container();

export const runClient = async (client: Client) => {
	const pool = new Pool({
		connectionString: process.env.PG_URL,
	});

	const db = drizzle<typeof schema>(pool, {
		schema: schema,
	});

	client.login(getEnv('TOKEN')).catch((e) => {
		console.error('❌ Login failed:', e);
		process.exit(1);
	});

	try {
		await migrate(db, {
			migrationsFolder: path.resolve(
				path.dirname(__filename),
				'../../db/drizzle',
			),
			migrationsSchema: path.resolve(
				path.dirname(__filename),
				'../../db/schema',
			),
		});
	} catch {}
};

const registerMaster = async () => {
	console.log('==========話者・感情登録開始==========');
	const res = await fetch(`${getEnv('VOICEVOX_URI')}/speakers`, {
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const responses: SpeakerType[] = await res.json();

	const values = responses.flatMap((response) => {
		return response.styles.map((style) => {
			return {
				id: style.id,
				name: response.name,
				style: style.name,
			};
		});
	});

	const speakers = ['show', 'takeru', 'haruka', 'hikari', 'santa', 'bear'];

	const emotions = ['happiness', 'anger', 'sadness'];

	let cnt = 501;
	speakers.forEach((speaker) => {
		emotions.forEach((emotion) => {
			values.push({
				id: cnt,
				name: speaker,
				style: emotion,
			});
			cnt++;
		});
	});

	const store = container.current?.getDataStore();

	await store?.do(async (db) => {
		await createSpeakerEmotionMaster(db, values);
	});

	console.log('==========話者・感情登録終了==========');
};

registerMaster();

runClient(botClient);
