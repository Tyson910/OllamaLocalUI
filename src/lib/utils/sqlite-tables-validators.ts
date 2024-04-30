import { z } from 'zod';

// User schema
export const UserSchema = z.object({
	id: z.number().nullable(),
	display_name: z
		.string()
		.min(1, { message: 'Please provide a value' })
		.max(255, { message: 'This username is too long. Try Again' }),
	created_at: z.string().datetime({ offset: true }),
	updated_at: z.string().datetime({ offset: true }).optional(),
	deleted_at: z.string().datetime({ offset: true }).optional()
});

export type UserSchemaType = z.infer<typeof UserSchema>; 
export const newUserSchema = UserSchema.pick({ display_name: true });

// Convo schema
export const ConvoSchema = z.object({
	id: z.number().optional(),
	title: z.string().min(1).max(255),
	created_at: z.string().datetime({ offset: true }),
	updated_at: z.string().datetime({ offset: true }).optional(),
	deleted_at: z.string().datetime({ offset: true }).optional(),
	userId: z.number().optional()
});

// Message schema
export const MessageSchema = z.object({
	id: z.number().optional(),
	convoId: z.number(),
	role: z.enum(['user', 'assistant']),
	content: z.string().min(1).max(255),
	created_at: z.string().datetime({ offset: true }),
	updated_at: z.string().datetime({ offset: true }).optional(),
	deleted_at: z.string().datetime({ offset: true }).optional()
});
