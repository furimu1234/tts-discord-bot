import type { getDictionaries, getGlobalDictionaries } from '@tts/db';

/**辞書を置換する */
interface IdictionaryReplace {
	/**ユーザ辞書とグローバル辞書を置換する */
	auto: (
		baseText: string,
		dictionaries: Awaited<ReturnType<typeof getDictionaries>>,
		globalDictionaries: Awaited<ReturnType<typeof getGlobalDictionaries>>,
	) => Promise<string>;
}

export const dictionaryReplace = (): IdictionaryReplace => {
	const auto = async (
		baseText: string,
		dictionaries: Awaited<ReturnType<typeof getDictionaries>>,
		globalDictionaries: Awaited<ReturnType<typeof getGlobalDictionaries>> = [],
	): Promise<string> => {
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
