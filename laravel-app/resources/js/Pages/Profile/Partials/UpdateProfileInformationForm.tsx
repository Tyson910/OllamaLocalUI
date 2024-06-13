import type { FormEventHandler, ComponentPropsWithoutRef } from 'react';
import type { PageProps } from '@/types';

import { InputError } from '@/Components/InputError';
import { InputLabel } from '@/Components/InputLabel';
import { PrimaryButton } from '@/Components/PrimaryButton';
import { TextInput } from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import PhotoIcon from 'virtual:icons/heroicons/photo-20-solid';

function getImgURL(img: string | File) {
  if (img instanceof File) {
    return URL.createObjectURL(img);
  }
  return img;
}
export function UpdateProfileInformationForm({
  mustVerifyEmail,
  status,
  className = '',
}: {
  mustVerifyEmail: boolean;
  status?: string;
  className?: string;
}) {
  const { user } = usePage<PageProps>().props.auth;

  const { data, setData, post, errors, processing, progress, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email,
    avatar: user.avatar || undefined,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('profile.update'));
  };

  return (
    <section className={className}>
      <header>
        <h2 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
          Profile Information
        </h2>

        <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
          Update your account's profile information and email address.
        </p>
      </header>

      <form onSubmit={submit} className='mt-6 space-y-6'>
        <div>
          {progress && (
            <progress value={progress.percentage} max='100'>
              {progress.percentage}%
            </progress>
          )}
          <InputLabel htmlFor='avatar' value='Avatar' />
          <InputError className='mt-2' message={errors.avatar} />
          <FileUploadInput
            id='avatar'
            name='avatar'
            file={data?.avatar}
            handleChange={(e) => setData('avatar', e.target.files[0])}
          />
        </div>

        <div>
          <InputLabel htmlFor='name' value='Name' />
          <TextInput
            id='name'
            className='mt-1 block w-full'
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            required
            isFocused
            autoComplete='name'
          />
          <InputError className='mt-2' message={errors.name} />
        </div>

        <div>
          <InputLabel htmlFor='email' value='Email' />
          <TextInput
            id='email'
            type='email'
            className='mt-1 block w-full'
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            required
            autoComplete='username'
          />
          <InputError className='mt-2' message={errors.email} />
        </div>

        {mustVerifyEmail && user.email_verified_at === null && (
          <div>
            <p className='text-sm mt-2 text-gray-800 dark:text-gray-200'>
              Your email address is unverified.
              <Link
                href={route('verification.send')}
                method='post'
                as='button'
                className='underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
              >
                Click here to re-send the verification email.
              </Link>
            </p>

            {status === 'verification-link-sent' && (
              <div className='mt-2 font-medium text-sm text-green-600 dark:text-green-400'>
                A new verification link has been sent to your email address.
              </div>
            )}
          </div>
        )}

        <div className='flex items-center gap-4'>
          <PrimaryButton disabled={processing}>Save</PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter='transition ease-in-out'
            enterFrom='opacity-0'
            leave='transition ease-in-out'
            leaveTo='opacity-0'
          >
            <p className='text-sm text-gray-600 dark:text-gray-400'>Saved.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}

function FileUploadInput({
  file,
  handleChange,
  ...props
}: {
  file?: string | File;
  handleChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<ComponentPropsWithoutRef<'input'>, 'type'>) {
  if (!file) {
    return (
      <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
        <div className='text-center'>
          <PhotoIcon className='mx-auto size-12 text-gray-300' aria-hidden='true' />
          <div className='mt-4 flex text-sm leading-6 text-gray-600'>
            <InputLabel
              htmlFor={props.id}
              className='relative cursor-pointer rounded-md py-1 px-2 bg-white dark:text-gray-800 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'
            >
              <span>Upload a file</span>
              <input onChange={handleChange} {...props} type='file' className='sr-only' />
            </InputLabel>
            <p className='pl-1'>or drag and drop</p>
          </div>
          <p className='text-xs leading-5 text-gray-600'>PNG, JPG up to 10MB</p>
        </div>
      </div>
    );
  }

  // Otherwise we have a file/img to show
  return (
    <>
      <div className='mt-2 flex items-center gap-x-3'>
        <img className='inline-block size-32 object-cover rounded-full' src={getImgURL(file)} />
        <InputLabel
          htmlFor={props.id}
          className='relative cursor-pointer rounded-md py-1 px-2 bg-white font-semibold dark:text-gray-800 text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2'
        >
          <span>Change</span>
          <input onChange={handleChange} {...props} type='file' className='sr-only' />
        </InputLabel>
      </div>
    </>
  );
}
