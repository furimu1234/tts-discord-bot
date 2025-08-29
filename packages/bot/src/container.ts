import { MakeDataStore, schema } from '@tts/db';
import { Player, makeVoiceVoxClient } from '@tts/lib';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import pino from 'pino';

import type { VoiceConnection } from '@discordjs/voice';
import { makeReplaceClient } from '@tts/replace';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import type { ContainerRef, IContainer } from './types';
dotenv.config({ path: '../../.env' });

export const Container = (): IContainer => {
	const logger = pino({
		transport: {
			target: 'pino-pretty',
			level: 'info',
			options: {
				colorize: true,
				translateTime: 'yyyy-mm-dd HH:MM:ss',
				ignore: 'pid,hostname',
			},
		},
	});

	const getDataStore = () => {
		const pool = new Pool({
			connectionString: process.env.POSTGRESQL_URL,
		});

		const client = drizzle<typeof schema>(pool, {
			schema: schema,
		});

		const dataStore = MakeDataStore(client);
		return dataStore;
	};

	const getVoiceVoxClient = () => {
		return makeVoiceVoxClient(logger);
	};

	const getPlayer = (connection: VoiceConnection) => {
		return Player(connection);
	};

	const getReplaceClient = () => {
		return makeReplaceClient();
	};

	return {
		logger,
		getDataStore,

		getVoiceVoxClient,
		getPlayer,
		getReplaceClient,
	};
};

export const container: ContainerRef = { current: undefined };

export const botClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.GuildMember, Partials.User],
});

botClient.setMaxListeners(30);
