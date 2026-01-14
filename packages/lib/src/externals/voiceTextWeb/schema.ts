import z from 'zod';

export const vtSpeedSchema = z.number().min(50).max(400);
export const vtPitchSchema = z.number().min(50).max(200);
export const vtEmotionLevelSchema = z.number().min(1).max(4);

export const voiceTextSchema = z.object({
	speaker: z.union([
		z.literal('hikari'),
		z.literal('haruka'),
		z.literal('show'),
		z.literal('takeru'),
		z.literal('santa'),
		z.literal('bear'),
	]),
	emotion: z.union([
		z.literal('happiness'),
		z.literal('anger'),
		z.literal('sadness'),
	]),
	emotionLevel: vtEmotionLevelSchema,
	pitch: vtPitchSchema,
	speed: vtSpeedSchema,
	volume: z.literal(100),
	text: z.string(),
	format: z.string().nullish(),
});

export type VoiceText = z.infer<typeof voiceTextSchema>;
