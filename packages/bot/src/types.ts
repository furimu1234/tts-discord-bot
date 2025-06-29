import type { DataStoreInterface } from '@tts/db';
import type { IVoiceTextWebClient, IVoiceVoxClient } from '@tts/generatevoice';
import type {
	Interaction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';
import type pino from 'pino';

export interface IContainer {
	logger: pino.Logger;
	getDataStore: () => DataStoreInterface;
	getVoiceTextWebClient: () => IVoiceTextWebClient;
	getVoiceVoxClient: () => IVoiceVoxClient;
}

export type Ref<T> = { current?: T };
export type ContainerRef = Ref<IContainer>;

export type commandExecute = (interaction: Interaction) => Promise<void>;
export type slashCommands = RESTPostAPIChatInputApplicationCommandsJSONBody[];
