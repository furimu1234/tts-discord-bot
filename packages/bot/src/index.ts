import { Events } from 'discord.js';

import type { Logger } from 'pino';
import { Container, botClient, container } from './container';

import path from 'node:path';
import { schema } from '@tts/db';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { loadCommands } from './commands/main';
import { loadEvents } from './loadEvents';

let logger: Logger<never, boolean>;

loadEvents(botClient, path.resolve(path.dirname(__filename), './events'));

botClient.once(Events.ClientReady, async () => {
	const client = botClient;

	container.current = Container();

	logger = container.current.logger;

	if (client.user) {
		logger.info('=============BOT START=============');
		logger.info(client.user?.displayName);
		const commands = await loadCommands();
		//await slashCommandRegister(client.user, commands);
	}
});

botClient.on(Events.Error, async (error) => {
	console.error(error);
});

console.log('TOKEN: ', process.env.TOKEN);

export const runClient = async () => {
	const pool = new Pool({
		connectionString: process.env.POSTGRESQL_URL,
	});

	const db = drizzle<typeof schema>(pool, {
		schema: schema,
	});

	await migrate(db, {
		migrationsFolder: path.resolve(
			path.dirname(__filename),
			'../../db/drizzle',
		),
		migrationsSchema: path.resolve(path.dirname(__filename), '../../db/schema'),
	});

	botClient.login(process.env.TOKEN);
};

runClient();
