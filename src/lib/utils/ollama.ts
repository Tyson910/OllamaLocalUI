import { z } from 'zod';

const modelEnumSchema = z.enum(['llama3']).default('llama3');
const roleEnumSchema = z.enum(['user', 'assistant']);

// const ollamaMessageContentSchema = z.object({
//   data: z
//     .object({
//       property: z.enum(['answer']),
//       value: z.string(),
//       related_info: z.string().nullable()
//     })
//     .array(),
//   errors: z
//     .object({
//       code: z.number(),
//       message: z.string()
//     })
//     .array()
// });

// type OllamaMessageContent = z.infer<typeof ollamaMessageContentSchema>;

export const ollamaResponseSchema = z.object({
	model: modelEnumSchema,
	created_at: z.string().datetime({ offset: true }),
	done: z.boolean(),
	message: z.object({
		role: roleEnumSchema.exclude(['user']),
		content: z.string()
	})
}).passthrough();

export type OllamaResponse = z.infer<typeof ollamaResponseSchema>;

export const ollamaRequestSchema = z.object({
	model: modelEnumSchema,
	format: z.enum(['json']).default('json'),
	stream: z.boolean().default(true),
	messages: z
		.object({
			role: roleEnumSchema,
			content: z.string()
		})
		.array()
});

// type OllamaRequest = z.infer<typeof ollamaRequestSchema>;

