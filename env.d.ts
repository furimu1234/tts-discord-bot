declare namespace NodeJS {
	interface ProcessEnv {
		readonly PORT: string;
		readonly NODE_ENV: "development" | "production" | "test";
		readonly DATABASE_URL: string;
	}
}
