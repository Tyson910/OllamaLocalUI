import type { ButtonHTMLAttributes } from 'react';
import SvgSpinners3DotsScaleIcon from 'virtual:icons/svg-spinners/3-dots-scale';
import classNames from 'classnames';

export function PrimaryButton({
  className = '',
  disabled,
  isLoading = false,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }) {
  return (
    <button
      {...props}
      className={classNames(
        `inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 
          border border-transparent rounded-md font-semibold text-xs 
          text-white dark:text-gray-800 uppercase tracking-widest
          hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none
          focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150`,
        (disabled || isLoading) && 'opacity-25',
        className,
      )}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <SvgSpinners3DotsScaleIcon className='size-4 mr-4' />
          Loading
        </>
      ) : (
        children
      )}
    </button>
  );
}
