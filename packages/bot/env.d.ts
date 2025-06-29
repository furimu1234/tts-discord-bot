declare namespace NodeJS {
	interface ProcessEnv {
		readonly TOKEN: string;
		readonly POSTGRESQL_URL: string;
		readonly VoiceTextWebAPIKey: string;
	}
}
