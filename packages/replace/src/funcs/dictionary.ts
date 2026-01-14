import type { getDictionaries } from '@tts/db';

export type IDictionaryResponse = Awaited<ReturnType<typeof getDictionaries>>;

/**辞書を置換する */
interface IDictionaryReplace {
	/**ユーザ辞書とグローバル辞書を置換する */
	auto: (baseText: string, dictionaries: IDictionaryResponse) => string;
}

export const DictionaryReplace = (): IDictionaryReplace => {
	const auto = (
		baseText: string,
		dictionaries: IDictionaryResponse,
	): string => {
		let replacedText = baseText;

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
