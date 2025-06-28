import type { emotion, speaker } from '../';

export interface MessageType {
	message: string;
	author_name: string;
	author_id: number;
	channel_id: number;
}

export interface VoiceTextWebApiType {
	speaker: speaker;
	emotion: emotion;
	emotionLevel: number;
	pitch: number;
	speed: number;
}

export interface VoiceTextWebApiTypeWithid {
	id: number | bigint;
	speaker: speaker;
	emotion: emotion;
	emotionLevel: number;
	pitch: number;
	speed: number;
}
