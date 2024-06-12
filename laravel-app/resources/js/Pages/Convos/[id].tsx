import type { PageProps } from '@/types';
import type { Convo, Message } from './types';

import { useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';

import RobotIcon from 'virtual:icons/fa6-solid/robot';
import PaperAirplaneIcon from '~icons/heroicons/paper-airplane-20-solid';

import { InputError } from '@/Components/InputError';
import { InputLabel } from '@/Components/InputLabel';
import { PrimaryButton } from '@/Components/PrimaryButton';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { useStreamResponse, useTypeSafePage } from '@/utils/hooks';

interface ConvoDetailProps extends PageProps {
  convo: Convo;
  messages: Message[];
}

export default function ConvoDetails({ auth, ziggy, convo, messages, ...rest }: ConvoDetailProps) {
  const { startStream, isPending, streamResponse, status, error } = useStreamResponse();
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

  const isLoading = processing || isPending;
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={convo.title} />
      <div className='max-w-2xl mx-auto p-4 sm:p-6 lg:p-8'>
        <h1 className='text-6xl mb-4 font-bold text-center dark:text-white'>{convo.title}</h1>
        <MessageHistory messages={messages} />
        <ReactMarkdown
          className='dark:text-white mb-5'
          children={streamResponse?.message.content}
        />
        <form onSubmit={saveStreamedMessageToDB}>
          <InputLabel htmlFor='message' className='sr-only'>
            New Message
          </InputLabel>
          <textarea
            rows={5}
            name='message'
            disabled={isLoading}
            className={classNames(
              'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
              isLoading && 'brightness-95',
              (errors.content || error != null) && 'ring-red-500',
            )}
            placeholder='Add your comment...'
            onChange={(e) => setData('content', e.target.value)}
            value={data.content}
          ></textarea>
          <InputError message={errors.content} className='mt-2' />
          {error ? (
            <InputError
              message={`An unexpected error has occured: ${error.message}`}
              className='mt-2'
            />
          ) : null}
          <div className='mt-2 flex justify-end'>
            <PrimaryButton isLoading={isLoading}>
              {messages?.length == 0 ? 'New Convo' : 'Send'}{' '}
              <PaperAirplaneIcon className='size-4 ml-2' />
            </PrimaryButton>
          </div>
          <p className='dark:text-white'>{status}</p>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}

/**
 *  Returns date in  "MM DD, YYYY" format
 * @param {string} dateStr - requires ISO 8601 date format (YYYY-MM-DD)
 * @returns {string}
 */
function getDateStrMMDDYYYY(dateStr: string): string {
  if (!dateStr) throw new Error('No date passed in');
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MessageHistory({ messages }: { messages: Message[] }) {
  const { auth } = useTypeSafePage().props;

  return (
    <div className='flow-root'>
      <ul role='list' className='-mb-8'>
        {messages.map((message, i) => (
          <li key={message.id}>
            <div className='relative pb-8'>
              {/* line that connects everything... */}
              {i !== messages.length - 1 ? (
                <span
                  className='absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200'
                  aria-hidden='true'
                />
              ) : null}
              <div className='relative flex items-start space-x-3'>
                <div className='relative'>
                  {message.role == 'assistant' ? (
                    <RobotIcon className='flex size-10 items-center justify-center rounded-full' />
                  ) : (
                    <img
                      className='flex size-10 items-center justify-center rounded-full'
                      src={
                        'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80'
                      }
                      alt=''
                    />
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='text-sm flex flex-row gap-x-2'>
                    <p className='font-medium text-gray-900 capitalize'>
                      {message.role == 'user' ? auth.user.name : message.role}
                    </p>
                    <p className='text-gray-500'>{getDateStrMMDDYYYY(message.created_at)}</p>
                  </div>
                  <div className='mt-2 text-sm text-gray-700'>
                    <ReactMarkdown className='dark:text-white' children={message.content} />
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
