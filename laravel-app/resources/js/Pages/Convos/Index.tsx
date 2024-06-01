import type { PageProps } from '@/types';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';

import { useForm, Head } from '@inertiajs/react';
import { InputError } from '@/Components/InputError';
import { TextInput } from '@/Components/TextInput';
import { PrimaryButton } from '@/Components/PrimaryButton';

type Convo = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

interface ConvosHubProps extends PageProps {
  convos: Convo[];
}

export default function ConvosHub({ auth, ziggy, convos }: ConvosHubProps) {
  const { data, setData, post, processing, reset, errors } = useForm({
    title: '',
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post(route('convos.store'), { onSuccess: () => reset() });
  }
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title='Convo History' />
      <div className='max-w-2xl mx-auto p-4 sm:p-6 lg:p-8'>
        <form onSubmit={submit}>
          <TextInput
            className='block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm'
            onChange={(e) => setData('title', e.target.value)}
            value={data.title}
          />
          <InputError message={errors.title} className='mt-2' />
          <PrimaryButton className='mt-4' disabled={processing}>
            New Convo
          </PrimaryButton>
        </form>
      {convos.map((convo, i) => (
        <ConvoPreview key={convo.id} convo={convo} />
      ))}
      </div>
    </AuthenticatedLayout>
  );
}

export function ConvoPreview({ convo }: { convo: Convo }) {
  return (
    <div className='p-6 flex space-x-2'>
      <div className='flex-1'>
        <div className='flex justify-between items-center'>
          <div>
            <p className='mb-1 text-lg text-gray-900'>{convo.title}</p>
            <small className='text-sm text-gray-600'>
              {new Date(convo.created_at).toLocaleString()}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
