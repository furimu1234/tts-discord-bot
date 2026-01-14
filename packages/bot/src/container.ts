import { MakeDataStore, schema } from '@tts/db';
import { makeVoiceTextWebClient, makeVoiceVoxClient } from '@tts/lib';
import { makeReplaceClient } from '@tts/replace';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { ContainerRef, IContainer } from './types';

dotenv.config({ path: '../../.env' });

export const Container = (): IContainer => {
	const getDataStore = () => {
		const pool = new Pool({
			connectionString: process.env.PG_URL,
		});

		const client = drizzle<typeof schema>(pool, {
			schema: schema,
		});

		const dataStore = MakeDataStore(client);
		return dataStore;
	};

	const getReplaceClient = () => {
		return makeReplaceClient();
	};

	const getVoiceVoxClient = () => {
		return makeVoiceVoxClient();
	};

	const getVOICETEXTWebClient = () => {
		return makeVoiceTextWebClient(process.env.VOICE_TEXT_WEB_API_KEY || '');
	};

	return {
		getDataStore,
		getReplaceClient,
		getVoiceVoxClient,
		getVOICETEXTWebClient,
	};
};

export const container: ContainerRef = { current: Container() };

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

botClient.setMaxListeners(0);

export const botClients = [botClient];
