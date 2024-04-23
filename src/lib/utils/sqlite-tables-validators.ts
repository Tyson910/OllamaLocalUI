import { z } from 'zod';

// User schema
export const UserSchema = z.object({
	id: z.number().optional(),
	displayName: z
		.string()
		.min(1, { message: 'Please provide a value' })
		.max(255, { message: 'This username is too long. Try Again' }),
	createdAt: z.string().datetime({ offset: true }),
	updatedAt: z.string().datetime({ offset: true }).optional(),
	deletedAt: z.string().datetime({ offset: true }).optional()
});

export const newUserSchema = UserSchema.pick({ displayName: true });

// Convo schema
export const ConvoSchema = z.object({
	id: z.number().optional(),
	title: z.string().min(1).max(255),
	createdAt: z.string().datetime({ offset: true }),
	updatedAt: z.string().datetime({ offset: true }).optional(),
	deletedAt: z.string().datetime({ offset: true }).optional(),
	userId: z.number().optional()
});

// Message schema
export const MessageSchema = z.object({
	id: z.number().optional(),
	convoId: z.number(),
	role: z.enum(['user', 'assistant']),
	content: z.string().min(1).max(255),
	createdAt: z.string().datetime({ offset: true }),
	updatedAt: z.string().datetime({ offset: true }).optional(),
	deletedAt: z.string().datetime({ offset: true }).optional()
});
