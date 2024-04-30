<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<div class="max-w-screen-xl mx-auto flex flex-col">
	<ul role="list" class="divide-y divide-gray-100">
		{#each data.allUsers as user}
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
				<a
					href={user.id}
					class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
				>
					Sign In
				</a>
			</li>
		{/each}
	</ul>
</div>
