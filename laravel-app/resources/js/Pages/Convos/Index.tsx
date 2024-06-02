import type { PageProps } from '@/types';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';

import { useState } from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import { InputError } from '@/Components/InputError';
import { TextInput } from '@/Components/TextInput';
import { PrimaryButton } from '@/Components/PrimaryButton';
import { Dropdown } from '@/Components/Dropdown';

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

// TODO: find a better abstraction for this component
function ConvoPreview({ convo }: { convo: Convo }) {
  const { auth } = usePage().props;

  const [editing, setEditing] = useState(false);

  const { data, setData, patch, clearErrors, reset, errors, processing } = useForm({
    title: convo.title,
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    patch(route('convos.update', convo.id), { onSuccess: () => setEditing(false) });
  }

  return (
    <div className='p-6 flex space-x-2'>
      <div className='flex-1 group hover:cursor-pointer'>
        <div className='flex justify-between items-center'>
          <div className='w-full'>
            {editing ? (
              <form onSubmit={submit} className=''>
                <TextInput
                  className='block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm'
                  onChange={(e) => setData('title', e.target.value)}
                  value={data.title}
                />
                <InputError message={errors.title} className='mt-2' />
                <div className='space-x-2'>
                  <PrimaryButton className='mt-4'>Save</PrimaryButton>
                  <button
                    className='mt-4'
                    onClick={() => {
                      setEditing(false);
                      reset();
                      clearErrors();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className='mb-1 text-lg text-gray-900 group-hover:underline'>{convo.title}</p>
            )}
            <small className='text-sm text-gray-600'>
              {new Date(convo.created_at).toLocaleString()}
            </small>
          </div>
        </div>
      </div>
      <Dropdown>
        <Dropdown.Trigger>
          <button>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 text-gray-400'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z' />
            </svg>
          </button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <button
            className='block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out'
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <Dropdown.Link as='button' href={route('convos.destroy', convo.id)} method='delete'>
            Delete
          </Dropdown.Link>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
