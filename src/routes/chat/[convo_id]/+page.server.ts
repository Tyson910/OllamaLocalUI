import { db } from '$lib/utils/kysely';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const convoHistory = await db
		.selectFrom('message')
		.select(['message.id', 'message.role', 'message.content'])
		.where('message.convo_id', '=', event.params.convo_id as unknown as number)
		.execute();

	return {
		convoHistory
	};
}) satisfies PageServerLoad;
