import type { ComponentPropsWithoutRef } from 'react';

import PhotoIcon from 'virtual:icons/heroicons/photo-20-solid';
import { InputLabel } from '@/Components/InputLabel';

function getImgURL(img: string | File) {
  if (img instanceof File) {
    return URL.createObjectURL(img);
  }
  return img;
}

export function FileUploadInput({
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
