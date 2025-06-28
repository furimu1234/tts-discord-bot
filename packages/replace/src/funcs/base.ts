/**ベース置換 */
interface IBaseReplace {
	/**wwwを草に置換する */
	kusa: (baseText: string) => string;
}

export const BaseReplace = (): IBaseReplace => {
	const kusa = (baseText: string): string => {
		return baseText.replace(/w{2,}/g, '草');
	};

	return {
		kusa,
	};
};
