import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ollamaResponseSchema, ollamaRequestSchema } from '$lib/utils/ollama';

export const POST: RequestHandler = async ({ url, request, ...rest }) => {
	let agentResponse = '';

	const bread = {
		messages: [
			// ...data.convoHistory,
			{
				role: 'user',
				content:
					"I'm testing a REST API to ask you questions. Respond back with some fun facts about cacti"
			}
		]
	};

	const llmResponse = await fetch('http://127.0.0.1:11434/api/chat', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(ollamaRequestSchema.parse(bread))
	});

	console.log(llmResponse.status);
	if (!llmResponse.body) throw new Error('Missing request body!');

	try {
		console.log('parsing body');
		// Create a transform stream
		const transformStream = new TransformStream({
			transform(chunk, controller) {
				// Transform the data here if needed
				controller.enqueue(chunk);
			}
		});

		// Create a destination readable stream
		const destinationStream = transformStream.readable;

		// Pipe the source stream through the transform stream
		llmResponse.body.pipeTo(transformStream.writable);

		return new Response(destinationStream, {
			status: 200,
			headers: { 'Content-Type': 'text/plain' }
		});
	} catch (err) {
		console.error(error);
		error(500, { message: 'An unexpected error has occured' });
	}
};
