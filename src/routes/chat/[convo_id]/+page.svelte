<script lang="ts">
	import { ollamaResponseSchema, ollamaRequestSchema } from '$lib/utils/ollama';
	import { marked } from 'marked';
	import type { PageData } from './$types';
	import { db } from '$lib/utils/kysely';

	import { page } from '$app/stores';

	export let data: PageData;

	let searchInput =
		"I'm testing a REST API to ask you questions. Respond with some facts about the Sonoran Desert.";
	let agentResponse = '';

	async function readData() {
		await db
			.insertInto('message')
			.values({
				role: 'user',
				content: searchInput,
				convo_id: $page.params.convo_id as unknown as number,
				created_at: new Date().toISOString()
			})
			.executeTakeFirst();

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
		const response = await fetch('http://localhost:11434/api/chat', {
			method: 'POST',
			body: JSON.stringify(validatedRequestBody)
		});

		if (!response.body) throw new Error('Missing request body!');
		try {
			console.log('parsing body');
			const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
			while (true) {
				const { value } = await reader.read();
				if (!value) {
					throw new Error();
				}
				const validatedResponse = ollamaResponseSchema.parse(JSON.parse(value));
				agentResponse += validatedResponse.message.content;
				if (validatedResponse.done) break;
			}
		} catch (error) {
			console.error(error);
		}
		// TODO: dont do this from the client!
		await db
			.insertInto('message')
			.values({
				role: 'agent',
				content: agentResponse,
				convo_id: $page.params.convo_id as unknown as number,
				created_at: new Date().toISOString()
			})
			.executeTakeFirst();

            searchInput = ''
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
