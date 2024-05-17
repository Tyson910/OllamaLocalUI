<script lang="ts">
	import { Toaster, toast } from 'svelte-sonner';
	import type { UserSchemaType } from '@utils/sqlite-tables-validators';
	import { actions, ActionError } from 'astro:actions';

	export let users: Pick<UserSchemaType, 'id' | 'created_at' | 'display_name'>[] = [];

	async function logUserIn(userId: (typeof users)[number]['id']) {
		try {
			const result = await actions.signIn({ id: userId });
			toast.success(result);
			// navigate to chat!
      // window.location.href = '/chat'
			// 		goto('/chat');
		} catch (error) {
			if (error instanceof ActionError) {
				toast.error(error.message);
			} else {
				toast.error('An unexpected error has occured');
			}
		}
	}
</script>

<Toaster />
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
			<form
				method="POST"
				on:submit={(e) => {
					e.preventDefault();
					logUserIn(user.id);
				}}
			>
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
