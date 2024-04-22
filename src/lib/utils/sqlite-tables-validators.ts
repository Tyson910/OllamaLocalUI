import { z } from 'zod';

// User schema
export const UserSchema = z.object({
	id: z.number().optional(),
	displayName: z.string().min(1).max(255),
	createdAt: z.string().datetime({ offset: true }),
	updatedAt: z.string().datetime({ offset: true }).optional(),
	deletedAt: z.string().datetime({ offset: true }).optional()
});

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
