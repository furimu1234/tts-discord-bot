import type { SendableChannels } from 'discord.js';

export class SendError extends Error {
	constructor(
		public channel: SendableChannels,
		message: string,
	) {
		super(message);
		this.name = 'ChannelError';
	}
}
