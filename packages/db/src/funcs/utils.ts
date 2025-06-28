import { z } from 'zod';
import type {
	SchemaDB,
	dictionaryFilterWithEnable,
	emotion,
	speaker,
} from '../';

export function getRandomSpeakerId(maxSize = 39): number {
	return Math.floor(Math.random() * maxSize);
}
export function getRandomEmotionIndex(maxSize: number): number {
	return Math.floor(Math.random() * maxSize);
}

export function getRandomInRange(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomDoubleInRange(min: number, max: number): number {
	return Math.round(Math.random() * (max - min) + min * 100) / 100;
}

interface VoiceTextParams {
	db: SchemaDB;
	baseUrl: string;
	apiKey: string;
	text: string;
	userId: string;
	speaker: speaker;
	emotion?: emotion | null;
	emotionLevel?: number | null;
	pitch: number;
	speed: number;
	volume?: number;
}

export interface voiceByteInterface {
	byteArray: Uint8Array | null;
	replacedText: string;
}

export const zodenumFromObjKeys = <K extends string>(
	obj: Record<K, unknown>,
): z.ZodEnum<[K, ...K[]]> => {
	const [firstKey, ...otherKeys] = Object.keys(obj) as K[];
	return z.enum([firstKey, ...otherKeys]);
};

interface disableDictionariesInterface {
	globalDictionaries: dictionaryFilterWithEnable[];
	userDictionaries: dictionaryFilterWithEnable[];
}

/**無効化辞書を除外する */
export async function ignoreDisableDictionaries(
	globalDictionaries: dictionaryFilterWithEnable[],
	userDictionaries: dictionaryFilterWithEnable[],
	ignore = true,
): Promise<disableDictionariesInterface> {
	let filterdGlobal = globalDictionaries;
	let filterdUser = userDictionaries;
	console.log(ignore, filterdGlobal, filterdUser);

	if (ignore) {
		filterdGlobal = globalDictionaries.filter((x) => x.enable === true);
		filterdUser = userDictionaries.filter((x) => x.enable === true);
	}
	return {
		globalDictionaries: filterdGlobal,
		userDictionaries: filterdUser,
	};
}
