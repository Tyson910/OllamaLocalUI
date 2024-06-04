import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export function useTypeSafePage() {
  return usePage<PageProps>();
}

export function useStreamResponse({
  streamCallback,
}: {
  streamCallback: React.Dispatch<React.SetStateAction<string>>;
}) {
  // entire response text
  const [responses, setResponses] = useState('');
  // data I want to send to consumer/caller
  const [data, setData] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: startStream } = useMutation({
    mutationFn: async (messageContent: string) => {
      // const ollamaRequestSchema = z.object({
      //   model: modelEnumSchema,
      //   stream: z.boolean().default(true),
      //   messages: z
      //     .object({
      //       role: roleEnumSchema,
      //       content: z.string(),
      //     })
      //     .array(),
      // });

      const response = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ content: messageContent, role: 'user' }],
          stream: true,
          model: 'llama3',
        }),
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      const reader = response.body.getReader();
      return reader;
    },
    onSuccess: (reader) => {
      setIsLoading(true);
      readStream(reader);
    },
  });

  async function readStream(reader: ReadableStreamDefaultReader) {
    async function read() {
      const { done, value } = await reader.read();
      if (done) {
        setIsLoading(false);
        return;
      }

      const text = new TextDecoder().decode(value);

      try {
        // TODO: use zod schema to parse these responses
        const obj = JSON.parse(text);
        setResponses((prev) => prev + obj?.message?.content);
        streamCallback((prevValue) => prevValue + obj?.message?.content);
      } catch (err) {
        console.log(err);
      }
      read();
    }
    read();
  }

  return { responses, data, startStream, isLoading };
}
