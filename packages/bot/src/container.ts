import { MakeDataStore, schema } from '@tts/db';

import { VoiceVoxClient, voiceTextWebClient } from '@tts/generatevoice';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import pino from 'pino';

import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import type { ContainerRef, IContainer } from './types';
console.log('CWD: ', process.cwd());
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

	const getVoiceTextWebClient = () => {
		return voiceTextWebClient(process.env.VoiceTextWebAPIKey);
	};
	const getVoiceVoxClient = () => {
		return VoiceVoxClient();
	};

	return {
		logger,
		getDataStore,
		getVoiceTextWebClient,
		getVoiceVoxClient,
	};
};

export const container: ContainerRef = { current: undefined };

export const ttsBotClient1 = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.GuildMember, Partials.User],
});
export const ttsBotClient2 = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers,
	],
	partials: [Partials.GuildMember, Partials.User],
});
export const ttsBotClient3 = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers,
	],
	partials: [Partials.GuildMember, Partials.User],
});
export const ttsBotClient4 = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers,
	],
	partials: [Partials.GuildMember, Partials.User],
});

ttsBotClient1.setMaxListeners(30);
ttsBotClient2.setMaxListeners(30);
ttsBotClient3.setMaxListeners(30);
ttsBotClient4.setMaxListeners(30);
