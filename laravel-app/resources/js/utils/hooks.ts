import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { ollamaRequestSchema, type OllamaRequest, ollamaResponseSchema } from '@/utils/ollama';

export function useTypeSafePage() {
  return usePage<PageProps>();
}

export function useStreamResponse() {
  // entire response text
  const [responses, setResponses] = useState('');
  const {
    mutate: startStream,
    isPending,
    ...rest
  } = useMutation({
    mutationFn: async (messageContent: OllamaRequest['messages']) => {
      const validatedOllamaRequestBody = ollamaRequestSchema.parse({ messages: messageContent });
      const response = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedOllamaRequestBody),
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) {
          throw new Error();
        }

        try {
          const validatedResponse = ollamaResponseSchema.parse(JSON.parse(value));
          setResponses((prev) => prev + validatedResponse.message.content);
          if (validatedResponse.done) break;
        } catch (err) {
          console.log(err);
        }
      }
    },
  });

  return { responses, startStream, isPending, ...rest };
}
