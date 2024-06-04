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
    content: '',
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
      <Head title={`Convo | ${convo.title}`} />
      <div className='max-w-2xl mx-auto p-4 sm:p-6 lg:p-8'>
        <h1 className='text-6xl mb-4 font-bold text-center dark:text-white'>{convo.title}</h1>
        <form onSubmit={submit}>
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
