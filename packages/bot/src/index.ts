import { Events } from 'discord.js';

import type { Logger } from 'pino';
import {
	Container,
	container,
	ttsBotClient1,
	ttsBotClient2,
	ttsBotClient3,
	ttsBotClient4,
} from './container';

import path from 'node:path';
import { loadCommands } from './commands/main';
import { slashCommandRegister } from './commands/utils/register';
import { loadEvents } from './loadEvents';

let logger: Logger<never, boolean>;

loadEvents(ttsBotClient1, path.resolve(path.dirname(__filename), './events'));

ttsBotClient1.once(Events.ClientReady, async () => {
	const client = ttsBotClient1;

	container.current = Container();

	logger = container.current.logger;

	if (client.user) {
		logger.info('=============BOT START=============');
		logger.info(client.user?.displayName);
		const commands = await loadCommands();
		//await slashCommandRegister(client.user, commands);
	}
});
ttsBotClient2.once(Events.ClientReady, async () => {
	const client = ttsBotClient2;

	container.current = Container();

	logger = container.current.logger;

	if (client.user) {
		logger.info('=============BOT START=============');
		logger.info(client.user?.displayName);
		const commands = await loadCommands();
		await slashCommandRegister(client.user, commands);
	}
});
ttsBotClient3.once(Events.ClientReady, async () => {
	const client = ttsBotClient3;

	container.current = Container();

	logger = container.current.logger;

	if (client.user) {
		logger.info('=============BOT START=============');
		logger.info(client.user?.displayName);
		const commands = await loadCommands();
		await slashCommandRegister(client.user, commands);
	}
});
ttsBotClient4.once(Events.ClientReady, async () => {
	const client = ttsBotClient4;

	container.current = Container();

	logger = container.current.logger;

	if (client.user) {
		logger.info('=============BOT START=============');
		logger.info(client.user?.displayName);
		const commands = await loadCommands();
		await slashCommandRegister(client.user, commands);
	}
});

ttsBotClient1.on(Events.Error, async (error) => {
	console.error(error);
});
ttsBotClient2.on(Events.Error, async (error) => {
	console.error(error);
});
ttsBotClient3.on(Events.Error, async (error) => {
	console.error(error);
});
ttsBotClient4.on(Events.Error, async (error) => {
	console.error(error);
});

console.log('TOKEN: ', process.env.TOKEN);

ttsBotClient1.login(process.env.TOKEN);
