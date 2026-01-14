export * from './confirm';
export * from './consts';
export * from './dialog';
export * from './errors';
export * from './externals';
export * from './messages';
export * from './random';
export * from './random';
export * from './selector';
export * from './wrap';

export const sleep = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms * 1000));
};
