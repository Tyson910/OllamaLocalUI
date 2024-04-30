<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { marked } from 'marked';
	import type { PageData } from './$types';
	import { ollamaResponseSchema, ollamaRequestSchema } from '$lib/utils/ollama';
	export let data: PageData;

	let searchInput =
		"I'm testing a REST API to ask you questions. Respond with some facts about the Sonoran Desert.";
	let agentResponse = '';

	async function readData() {
		agentResponse = '';
		const validatedRequestBody = ollamaRequestSchema.parse({
			messages: [
				...data.convoHistory,
				{
					role: 'user',
					content: searchInput
				}
			]
		});

		console.log('submitting request');
		const response = await fetch('/chat/2', {
			method: 'POST',
			body: JSON.stringify(validatedRequestBody)
		});

		if (!response.body) throw new Error('Missing request body!');
		if (response.status == 500) {
			throw new Error('500 response from API');
		}
		try {
			const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
			console.log(reader);
			while (true) {
				console.log('reading....');
				const { value, done } = await reader.read();
				if (!value) {
					throw new Error();
				}
				const validatedResponse = ollamaResponseSchema.parse(JSON.parse(value));
				agentResponse += validatedResponse.message.content;
				console.log(agentResponse);
				if (validatedResponse.done) break;
				if (done) break;
			}
			// searchInput = ''
		} catch (error) {
			console.error(error);
			toast.error('An unexpected error occured');
		}
	}
</script>

<div class="max-w-screen-lg mx-auto">
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

	<div>
		{@html marked.parse(agentResponse)}
	</div>
</div>
