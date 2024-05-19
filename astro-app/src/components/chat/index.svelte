<script lang="ts">
	import { actions, ActionError } from 'astro:actions';

	import { ollamaBrowser } from '@utils/ollama';
	import type { DB } from '@utils/kysely';
	import MessageDisplay from './MessageDisplay.svelte';

	export let messages: DB['message'][] = [];

	let searchInput =
		"I'm testing a REST API to ask you questions. Respond with some facts about the Sonoran Desert.";
	let agentResponse = '';

	async function readData() {
		agentResponse = '';

		try {
			// 1. Send new message to astro action
			const result = await actions.newMessage({ content: searchInput, role: 'user' });
			// 2. Send old & new messages to ollama
			const response = await ollamaBrowser.chat({
				model: 'llama3',
				stream: true,
				messages: [...messages, { role: 'user', content: result.content }]
			});
			// 3. Stream ollama response
			for await (const part of response) {
				if (!part.done) {
					agentResponse += part.message.content;
				} else {
					// 4. On stream complete, send to actions.newMessage(streamData)
					console.log('done!');
					const result2 = await actions.newMessage({ content: agentResponse, role: 'assistant' });
				}
			}
		} catch (error) {}
	}
</script>

<div class="max-w-screen-lg mx-auto">
	<MessageDisplay
		messages={!!agentResponse
			? [...messages, { content: agentResponse, role: 'assistant' }]
			: messages}
	/>
	<form on:submit|preventDefault={readData} class="my-40">
		<div>
			<label for="chat-message" class="block text-sm font-medium leading-6 text-gray-900"
				>Search</label
			>
			<div class="mt-2">
				<input
					type="text"
					name="chat-message"
					id="chat-message"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					bind:value={searchInput}
				/>
			</div>
		</div>
		<button type="submit">Submit</button>
	</form>
</div>
