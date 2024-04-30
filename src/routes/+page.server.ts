import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod as SuperFormZod } from 'sveltekit-superforms/adapters';

import { newUserSchema } from '$lib/utils/sqlite-tables-validators';
import { db } from '$lib/utils/kysely';

export const load = (async () => {
	const allUsers = await db
		.selectFrom('user')
		.select(['user.id', 'user.display_name', 'user.created_at'])
		.execute();
	return {
		allUsers
	};
}) satisfies PageServerLoad;

export const actions = {
	'new-user': async (event) => {
		// TODO log the user in
		const form = await superValidate(event.request, SuperFormZod(newUserSchema));

		if (!form.valid) {
			// Will return fail(400, { form }) since form isn't valid
			return message(form, { text: 'Invalid form', type: 'error' });
		}

		try {
			await db
				.insertInto('user')
				.values({ ...form.data, created_at: new Date().toISOString() })
				.executeTakeFirst();

			return message(form, { text: 'Success!', type: 'success' });
		} catch (error) {
			console.error(error);
			return message(form, { text: 'Unexpected Error', type: 'error' });
		}
	}
} satisfies Actions;
