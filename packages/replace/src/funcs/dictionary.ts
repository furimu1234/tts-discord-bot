import type { getDictionaries, getGlobalDictionaries } from '@tts/db';

export type IDictionaryResponse = Awaited<ReturnType<typeof getDictionaries>>;
export type IGlobalDictionaryResponse = Awaited<
	ReturnType<typeof getGlobalDictionaries>
>;

/**辞書を置換する */
interface IDictionaryReplace {
	/**ユーザ辞書とグローバル辞書を置換する */
	auto: (
		baseText: string,
		dictionaries: IDictionaryResponse,
		globalDictionaries: IGlobalDictionaryResponse,
	) => string;
}

export const DictionaryReplace = (): IDictionaryReplace => {
	const auto = (
		baseText: string,
		dictionaries: IDictionaryResponse,
		globalDictionaries: IGlobalDictionaryResponse = [],
	): string => {
		let replacedText = baseText;

		if (globalDictionaries.length > 0) {
			for (const globalDitionary of globalDictionaries) {
				replacedText = replacedText.replace(
					globalDitionary.beforeWord,
					globalDitionary.afterWord,
				);
			}
		}

		for (const dictionary of dictionaries) {
			replacedText = replacedText.replace(
				dictionary.beforeWord,
				dictionary.afterWord,
			);
		}

		return replacedText;
	};

	return {
		auto,
	};
};
