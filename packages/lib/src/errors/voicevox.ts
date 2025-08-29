import { SendError } from './base';
import { MessageID } from './messages';

export class ResponseError extends SendError {
	constructor() {
		super(`${MessageID.vv.E00001()}`);

		this.name = 'ParseResponseError';

		Object.setPrototypeOf(this, new.target.prototype);
	}
}
