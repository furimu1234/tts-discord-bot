import type { VoiceConnection } from '@discordjs/voice';
import type { DataStoreInterface } from '@tts/db';
import type { Player, makeVoiceVoxClient } from '@tts/lib';
import type { makeReplaceClient } from '@tts/replace';
import type {
	Interaction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';
import type pino from 'pino';

export interface IContainer {
	logger: pino.Logger;
	getDataStore: () => DataStoreInterface;
	//getVoiceTextWebClient: () => IVoiceTextWebClient;
	getVoiceVoxClient: () => ReturnType<typeof makeVoiceVoxClient>;
	getPlayer: (connection: VoiceConnection) => ReturnType<typeof Player>;
	getReplaceClient: () => ReturnType<typeof makeReplaceClient>;
}

export type Ref<T> = { current?: T };
export type ContainerRef = Ref<IContainer>;

export type commandExecute = (interaction: Interaction) => Promise<void>;
export type slashCommands = RESTPostAPIChatInputApplicationCommandsJSONBody[];
