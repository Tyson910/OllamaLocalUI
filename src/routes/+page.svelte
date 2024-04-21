<script lang="ts">
	import { ollamaResponseSchema, ollamaRequestSchema } from '$lib/utils/ollama';

	let searchInput =
		"I'm testing a REST API to ask you questions. Respond with some facts about the Sonoran Desert";
	let agentResponse = '';

	let OllamaMessageContent = `{
      "type": "response", 
      /** your question **/
      "question": string
      data: {
          property: 'answer';
          /** my answer **/
          value: string;
          /** any additional information, fun facts or context **/
          related_info: string | null;
      }[];
      /** if there are no errors return empty array **/
      errors: {
        /** Any error_code **/
          code: number;
          /** Any error_message **/
          message: string;
      }[];
  }`;
	async function readData() {
		const validatedRequestBody = ollamaRequestSchema.parse({
			messages: [
				{
					role: 'user',
					content: searchInput + ` .Respond using JSON. Follow this format ${OllamaMessageContent}`
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
				const { value, done, ...rest } = await reader.read();

				if (done) break;

				if (!value) {
					throw new Error();
				}
				// TODO: clean up handling the 'done' status...not getting the full done response...
				const validatedResponse = ollamaResponseSchema.parse(JSON.parse(value));
				agentResponse += validatedResponse.message.content;
			}
		} catch (error) {
			console.error(error);
		}

    console.log('done!')
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
	<p>{agentResponse}</p>
</div>
