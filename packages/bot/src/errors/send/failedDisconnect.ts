import type { SendableChannels } from 'discord.js';
import { SendError } from './channel';

export class FailedDisconnect extends SendError {
	constructor(channel: SendableChannels) {
		super(channel, '切断に失敗しました。時間をおいて実行してみてください');
	}
}
