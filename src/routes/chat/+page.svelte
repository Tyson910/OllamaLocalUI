<script lang="ts">
	import { ollamaResponseSchema, ollamaRequestSchema } from '$lib/utils/ollama';
	import { marked } from 'marked';

	let searchInput =
		"I'm testing a REST API to ask you questions. Respond with some facts about the Sonoran Desert.";
	let agentResponse = '';

	async function readData() {
		const validatedRequestBody = ollamaRequestSchema.parse({
			messages: [
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
				// TODO: clean up handling the 'done' status...not getting the full done response...
				const validatedResponse = ollamaResponseSchema.parse(JSON.parse(value));
				agentResponse += validatedResponse.message.content;
				if (validatedResponse.done) break;
			}
		} catch (error) {
			console.error(error);
		}

		console.log('done!');
	}
</script>

<form on:submit|preventDefault={readData} class="max-w-screen-lg mx-auto my-40">
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

<div class="max-w-screen-lg mx-auto">
	{@html marked.parse(agentResponse)}
</div>
