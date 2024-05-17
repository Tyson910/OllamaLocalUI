<script lang="ts">
	import { marked } from 'marked';
	import type { DB } from '@utils/kysely';

	export let messages: DB['message'][] = [];
</script>

<div>
	{#each messages as message}
		<p>Role: {message.role}</p>
		{@html marked.parse(message.content)}
	{/each}
</div>
