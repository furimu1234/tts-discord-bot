export class SendError extends Error {
	isZod: boolean;
	constructor(message: string, isZod = false) {
		super(message);
		this.isZod = isZod;

		this.name = 'SendError';

		Object.setPrototypeOf(this, new.target.prototype);
	}
}
