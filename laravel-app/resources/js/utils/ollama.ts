import { z } from 'zod';

const modelEnumSchema = z.enum(['llama3']).default('llama3');
const roleEnumSchema = z.enum(['user', 'assistant']);


export const ollamaResponseSchema = z.object({
	model: modelEnumSchema,
	created_at: z.string().datetime({ offset: true }),
	done: z.boolean(),
	message: z.object({
		role: roleEnumSchema.exclude(['user']),
		content: z.string()
	})
});

export type OllamaResponse = z.infer<typeof ollamaResponseSchema>;

export const ollamaRequestSchema = z.object({
	model: modelEnumSchema,
	stream: z.boolean().default(true),
	messages: z
		.object({
			role: roleEnumSchema,
			content: z.string()
		})
		.array()
});

export type OllamaRequest = z.infer<typeof ollamaRequestSchema>;
