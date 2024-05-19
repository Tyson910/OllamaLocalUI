<script lang="ts">
	import { marked } from 'marked';
	import type { DB } from '@utils/kysely';

	export let messages: Pick<DB['message'], 'role' | 'content'>[] = [];
</script>

<div>
	{#each messages as message}
		<p>Role: {message.role}</p>
		{@html marked.parse(message.content)}
	{/each}
</div>
