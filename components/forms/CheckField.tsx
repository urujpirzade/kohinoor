// CheckField.tsx
'use client';

import { InputHTMLAttributes } from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

// Define the props interface, inheriting standard checkbox attributes
interface CheckFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string; // The text displayed next to the checkbox
  name: string; // The name used for react-hook-form registration
  register: UseFormRegister<any>; // react-hook-form register function
  error?: FieldError; // Optional error object from react-hook-form
  helperText?: string; // Optional helper text displayed below
  required?: boolean; // Optional flag to indicate if the field is required (visually)
  id?: string; // Optional id for the input and label's htmlFor
}

const CheckField = ({
  label,
  name,
  register,
  error,
  helperText,
  required,
  id,
  className, // Allow passing custom classes to the checkbox itself
  ...rest // Pass other standard input attributes (like disabled, defaultChecked etc.)
}: CheckFieldProps) => {
  const inputId = id || name; // Use provided id or default to name

  return (
    <div className='flex flex-col gap-1.5'>
      {' '}
      {/* Container for layout, similar to InputField */}
      <div className='flex items-center space-x-2'>
        {' '}
        {/* Structure from your example */}
        <input
          type='checkbox'
          id={inputId}
          {...register(name)} // Register the checkbox with react-hook-form
          {...rest} // Spread remaining props like disabled, etc.
          className={`h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
            className || ''
          } ${
            error
              ? 'border-red-400 focus:ring-red-100'
              : 'border-gray-300 focus:ring-blue-100' // Basic error styling on border
          }`} // Basic styling + allow overriding/extending via props
        />
        <label
          htmlFor={inputId}
          className='text-sm font-medium w-[75%] text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1' // Adjusted classes slightly
        >
          {label}
          {required && <span className='text-red-500'>*</span>}{' '}
          {/* Show asterisk if required */}
        </label>
      </div>
      {/* Helper Text (only shown if there's no error) */}
      {helperText && !error && (
        <span className='text-xs text-gray-500 pl-1'>{helperText}</span>
      )}
      {/* Error Message Display (similar to InputField) */}
      {error && (
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
          {error.message || 'This field is required'}{' '}
          {/* Display error message */}
        </span>
      )}
    </div>
  );
};

export default CheckField;
