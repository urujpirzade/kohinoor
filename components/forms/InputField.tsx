// InputField.tsx
'use client';

import Image from 'next/image';
import { InputHTMLAttributes } from 'react';
import {
  UseFormRegister,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  helperText?: string;
  valueAsNumber?: boolean;
  required?: boolean;
}

const InputField = ({
  label,
  name,
  register,
  error,
  type = 'text',
  placeholder,
  helperText,
  valueAsNumber,
  required,
  ...rest
}: InputFieldProps) => {
  // Get the appropriate registration options
  const registerOptions = valueAsNumber
    ? { ...register(name, { valueAsNumber: true }) }
    : { ...register(name) };

  return (
    <div className='flex flex-col gap-1.5'>
      <label
        htmlFor={name}
        className='text-sm font-medium text-gray-700 flex items-center gap-1'
      >
        {label}
        {required && <span className='text-red-500'>*</span>}
      </label>

      <div className='relative'>
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...registerOptions}
          {...rest}
          className={`w-full px-4 py-2.5 rounded-lg border bg-white transition-all duration-200 outline-none ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          }`}
        />

        {type === 'number' && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
            <span className='text-gray-400 opacity-50 mr-4'>
              <Image src='/rupee.png' alt='rupee' height={22} width={22} />
            </span>
          </div>
        )}
      </div>

      {helperText && !error && (
        <span className='text-xs text-gray-500 pl-1'>{helperText}</span>
      )}

      {typeof error?.message === 'string' && (
        <span className='text-xs text-red-500 font-medium pl-1 flex items-center gap-1'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-3.5 w-3.5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
          {error?.message}
        </span>
      )}
    </div>
  );
};

export default InputField;
