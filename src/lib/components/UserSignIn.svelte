<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod as SuperFormZod } from 'sveltekit-superforms/adapters';

	import { UserSchema, type UserSchemaType } from '$lib/utils/sqlite-tables-validators';
	import { goto } from '$app/navigation';

	export let users: Pick<UserSchemaType, 'id' | 'created_at' | 'display_name'>[] = [];

	const { enhance } = superForm(defaults(SuperFormZod(UserSchema.pick({ id: true }))), {
		validators: SuperFormZod(UserSchema.pick({ id: true })),
		onUpdated({ form }) {
			if (form.message?.type == 'success' || form.message?.type == 'error') {
				toast[form.message.type](form.message.text);
			}
			goto('/chat');
		}
	});
</script>

<ul role="list" class="divide-y divide-gray-100">
	{#each users as user}
		<li class="flex items-center justify-between gap-x-6 py-5">
			<div class="flex min-w-0 gap-x-4">
				<!-- <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt="" /> -->
				<div class="min-w-0 flex-auto">
					<p class="text-sm font-semibold leading-6 text-gray-900">{user.display_name}</p>
					<p class="mt-1 truncate text-xs leading-5 text-gray-500">
						{new Date(user.created_at).toLocaleDateString()}
					</p>
				</div>
			</div>
			<form use:enhance method="POST" action="/?/sign-in">
				<input type="hidden" name="id" value={user.id} />
				<button
					type="submit"
					class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
				>
					Sign In
				</button>
			</form>
		</li>
	{/each}
</ul>
