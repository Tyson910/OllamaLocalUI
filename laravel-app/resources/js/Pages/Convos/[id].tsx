import type { PageProps } from '@/types';
import type { Convo, Message } from './types';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';

import { useForm, Head } from '@inertiajs/react';
import { InputError } from '@/Components/InputError';
import { PrimaryButton } from '@/Components/PrimaryButton';



interface ConvoDetailProps extends PageProps {
  convo: Convo 
  messages: Message[];
}

export default function ConvoDetails({ auth, ziggy, convo, messages,  ...rest }: ConvoDetailProps) {
  const { data, setData, post, processing, reset, errors } = useForm({
    content:
      "I'm testing a REST API to ask you questions. Respond with some facts about the Sonoran Desert.",
    convo_id: convo.id,
    role: 'user',
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post(route('messages.store'), { onSuccess: () => reset() });
  }

  console.log(convo);
  console.log(messages)
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={convo.title} />
      <div className='max-w-2xl mx-auto p-4 sm:p-6 lg:p-8'>
        <h1 className='text-6xl mb-4 font-bold text-center dark:text-white'>{convo.title}</h1>
        <div className='m'>
          {messages.map((message) => (
            <ReactMarkdown
              className='odd:bg-green-300 even:bg-green-200 rounded p-5 divide-y-yellow-500 divide-y'
              key={message.id}
              children={message.content}
            />
          ))}
        </div>
        <ReactMarkdown className='dark:text-white' children={responses} />
          <textarea
            className='block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm'
            onChange={(e) => setData('content', e.target.value)}
            value={data.content}
          ></textarea>
          <input type='hidden' name='convo_id' value={convo.id} />
          <input type='hidden' name='role' value={'user'} />
          <InputError message={errors.content} className='mt-2' />
          {messages?.length == 0 ? (
            <PrimaryButton className='mt-4' disabled={processing}>
              New Convo
            </PrimaryButton>
          ) : (
            <PrimaryButton className='mt-4' disabled={processing}>
              Submit
            </PrimaryButton>
          )}
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
