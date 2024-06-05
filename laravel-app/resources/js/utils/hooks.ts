import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ollamaRequestSchema,
  type OllamaRequest,
  ollamaResponseSchema,
  type OllamaResponse,
} from '@/utils/ollama';

export function useTypeSafePage() {
  return usePage<PageProps>();
}

export function useStreamResponse() {
  const [streamResponse, setstreamResponse] = useState<OllamaResponse | null>(null);

  const {
    mutate: startStream,
    isPending,
    ...rest
  } = useMutation({
    mutationFn: async (messageContent: OllamaRequest['messages']) => {
      const validatedOllamaRequestBody = ollamaRequestSchema.parse({ messages: messageContent });
      // ? replace w axios?
      const response = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedOllamaRequestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
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
          setstreamResponse((prev) => {
            if (prev != null) {
              return {
                ...prev,
                message: {
                  ...prev.message,
                  content: prev.message.content + validatedResponse.message.content,
                },
              };
            }
            return validatedResponse;
          });
          if (validatedResponse.done) break;
        } catch (err) {
          console.log(err);
        }
      }
    },
  });

  return { streamResponse, startStream, isPending, ...rest };
}
