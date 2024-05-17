<script lang="ts">
	import { marked } from 'marked';
	import type { ComponentProps } from 'svelte';

	import RootChatComponent from './index.svelte';
	
	export let messages: ComponentProps<RootChatComponent>['messages'];
</script>

<div>
	{#each messages as message}
		<p>Role: {message.role}</p>
		{@html marked.parse(message.content)}
	{/each}
</div>
