import type { PageProps } from '@/types';
import type { Convo, Message } from './types';

import { useForm, Head } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { InputError } from '@/Components/InputError';
import { PrimaryButton } from '@/Components/PrimaryButton';
import { useStreamResponse } from '@/utils/hooks';

interface ConvoDetailProps extends PageProps {
  convo: Convo;
  messages: Message[];
}

export default function ConvoDetails({ auth, ziggy, convo, messages, ...rest }: ConvoDetailProps) {
  const { startStream, isPending, streamResponse, status } = useStreamResponse();
  const { data, setData, post, processing, reset, errors } = useForm({
    content: '',
    convo_id: convo.id,
    role: 'user',
  });

  function saveStreamedMessageToDB(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // first save new message to DB
    post(route('messages.store'), {
      preserveScroll: true,
      onSuccess: ({ props }) => {
        // reset the form
        reset();
        const updatedMessages = props?.messages as unknown as Message[];
        // now get Ollama response
        startStream({
          convo_id: convo.id,
          messageContent: [
            ...updatedMessages.map((message) => ({
              content: message.content,
              role: message.role,
            })),
          ],
        });
      },
    });
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={convo.title} />
      <div className='max-w-2xl mx-auto p-4 sm:p-6 lg:p-8'>
        <h1 className='text-6xl mb-4 font-bold text-center dark:text-white'>{convo.title}</h1>
        <div className='m'>
          {messages.map((message) => (
            <ReactMarkdown
              className='odd:bg-green-300 even:bg-green-200 rounded p-5'
              key={message.id}
              children={message.content}
            />
          ))}
        </div>
        <ReactMarkdown className='dark:text-white' children={streamResponse?.message.content} />
        <form onSubmit={saveStreamedMessageToDB}>
          <textarea
            className='block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm'
            onChange={(e) => setData('content', e.target.value)}
            value={data.content}
          ></textarea>
          <InputError message={errors.content} className='mt-2' />
          <p className='dark:text-white'>{status}</p>
          <PrimaryButton className='mt-4' disabled={processing} isLoading={isPending}>
            {messages?.length == 0 ? 'New Convo' : 'Submit'}
          </PrimaryButton>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
