import type { DataStoreInterface } from '@tts/db';
import type { IVOICETEXTWebClient, IVoiceVoxClient } from '@tts/lib';
import type { IReplaceClient } from '@tts/replace';
import type {
	Interaction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

export type IContainer = {
	getDataStore: () => DataStoreInterface;
	getReplaceClient: () => IReplaceClient;
	getVoiceVoxClient: () => IVoiceVoxClient;
	getVOICETEXTWebClient: () => IVOICETEXTWebClient;
};

export type ContainerRef = { current: IContainer | undefined };
export type slashCommands = RESTPostAPIChatInputApplicationCommandsJSONBody[];

export type commandExecute = (interaction: Interaction) => Promise<void>;

export interface SpeakerType {
	id: number;
	name: string;
	styles: {
		id: number;
		name: string;
	}[];
}
