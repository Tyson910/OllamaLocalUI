import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ollamaResponseSchema, ollamaRequestSchema } from '$lib/utils/ollama';
import { db } from '$lib/utils/kysely';

export const POST: RequestHandler = async ({ request, params, ...rest }) => {
	try {
		const streamingResponse = await request.json();
		const validatedReqData = ollamaRequestSchema.parse(streamingResponse);

		// await db
		// 	.insertInto('message')
		// 	.values({
		// 		role: 'user',
		// 		content: validatedReqData.messages[validatedReqData.messages.length - 1].content,
		// 		convo_id: params.convo_id as unknown as number,
		// 		created_at: new Date().toISOString()
		// 	})
		// 	.executeTakeFirst();

		const llmResponse = await fetch('http://127.0.0.1:11434/api/chat', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(validatedReqData)
		});

		let agentResponse = '';
		if (!llmResponse.body) throw new Error('Missing request body!');

		console.log('Parsing OLLMA response body');
		// Create a transform stream
		const transformStream = new TransformStream<Uint8Array, Uint8Array>({
			transform(chunk, controller) {
				// Transform the data here if needed
				controller.enqueue(chunk);
				const decoder = new TextDecoder().decode(chunk, { stream: true });
				const validatedResponse = ollamaResponseSchema.parse(JSON.parse(decoder));
				agentResponse += validatedResponse.message.content;
			},
			async flush(controller) {
				console.log('Finished parsing stream');
				// console.log(agentResponse);
				console.log('Now writing to db');
				await db
					.insertInto('message')
					.values({
						role: 'assistantt',
						content: agentResponse,
						convo_id: params.convo_id as unknown as number,
						created_at: new Date().toISOString()
					})
					.executeTakeFirst();
			}
		});

		// Create a destination readable stream
		const destinationStream = transformStream.readable;

		// Pipe the source stream through the transform stream
		llmResponse.body.pipeTo(transformStream.writable).catch((err) => {
			console.error('bread:', err);
			error(500, { message: 'Bread unexpected error has occured' });
		});

		return new Response(destinationStream, {
			status: 200,
			statusText: 'OK',
			headers: { 'Content-Type': 'text/plain' }
		});
	} catch (err) {
		console.error(err);
		return error(500, { message: 'An unexpected error has occured' });
	}
};
