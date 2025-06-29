import type { InferSelectModel } from 'drizzle-orm';
import type {
	dictionary,
	guildInfo,
	usersVoicePreference,
	voicePreference,
} from './';
export interface voiceSettingFilter {
	voice_preference: InferSelectModel<typeof voicePreference> | null;
	users_voice_preference: InferSelectModel<typeof usersVoicePreference> | null;
}

export type guildInfoFilter = InferSelectModel<typeof guildInfo>;

export type mainVoiceSettingFilter = InferSelectModel<typeof voicePreference>;

export type subVoiceSettingFilter = InferSelectModel<
	typeof usersVoicePreference
>;

export type dictionaryFilter = InferSelectModel<typeof dictionary>;
export type dictionaryFilterWithEnable = InferSelectModel<typeof dictionary> & {
	enable: boolean;
};
