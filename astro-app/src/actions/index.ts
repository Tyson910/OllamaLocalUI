import { defineAction, ActionError, getApiContext } from 'astro:actions';
import { newUserSchema, UserSchema } from '@utils/sqlite-tables-validators';
import { db } from '@utils/kysely';

export const server = {
	newUser: defineAction({
		input: newUserSchema,
		handler: async (data) => {
			try {
				await db
					.insertInto('user')
					.values({ ...data, created_at: new Date().toISOString() })
					.executeTakeFirst();
			} catch (error) {
				console.error(error);
				throw new ActionError({
					code: 'INTERNAL_SERVER_ERROR',
					message: `Unable to create new user.`
				});
			}
		}
	}),
	signIn: defineAction({
		input: UserSchema.pick({ id: true }),
		handler: async (data) => {
			try {
				const user = await db
					.selectFrom('user')
					.select(['user.id', 'user.display_name', 'user.created_at'])
					.where('user.id', '=', data.id)
					.executeTakeFirst();
				if (!user || !user.id) {
					throw new ActionError({
						code: 'BAD_REQUEST',
						message: `Unable to sign in.`
					});
				}
				const apiContext = getApiContext();

				apiContext.cookies.set('user_id', user.id?.toString(), {
					path: '/',
					httpOnly: true
				});
				return `Success! Logged in as ${user.display_name}`;
			} catch (error) {
				if (error instanceof ActionError) {
					throw error;
				}
				console.error(error);
				throw new ActionError({
					code: 'INTERNAL_SERVER_ERROR',
					message: `Unable to sign in.`
				});
			}
		}
	})
};
