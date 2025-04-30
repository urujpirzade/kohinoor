// SelectField.tsx
'use client';

import { SelectHTMLAttributes } from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

// Define the structure for each option in the select dropdown
const options = [
  { value: 'mainHall', label: 'Main Hall' },
  { value: 'secondHall', label: 'Open Party Hall' },
];
const roleOptions = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'MANAGER', label: 'MANAGER' },
];

// Define the props for the SelectField component
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  helperText?: string;
  placeholder?: string; // Placeholder text for the default option
  required?: boolean;
}

const SelectField = ({
  label,
  name,
  register,
  error,
  placeholder = 'Select an option', // Default placeholder
  helperText,
  required,
  className, // Allow passing additional classes
  ...rest // Pass any other standard select attributes
}: SelectFieldProps) => {
  const opt = name === 'role' ? roleOptions : options;

  return (
    <div className='flex flex-col gap-1.5'>
      {/* Label */}
      <label
        htmlFor={name}
        className='text-sm font-medium text-gray-700 flex items-center gap-1'
      >
        {label}
        {required && <span className='text-red-500'>*</span>}
      </label>

      {/* Select Element Wrapper */}
      <div className='relative'>
        <select
          id={name}
          // Add required validation directly if needed: register(name, { required: 'This field is required' })
          {...register(name)} // Register the select field
          {...rest} // Spread other props like disabled, etc.
          className={`w-full px-4 py-2.5 rounded-lg border bg-white transition-all duration-200 outline-none appearance-none pr-8 ${
            // appearance-none hides default arrow, pr-8 makes space for custom arrow
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-red-900 placeholder-red-300' // Add error text color
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400' // Default text color
          } ${
            // Add class for placeholder styling when no value is selected
            (rest.value === '' || rest.value === undefined || !rest.value) &&
            !rest.defaultValue
              ? 'text-gray-400'
              : 'text-gray-900'
          } ${className || ''}`} // Combine base classes with any passed className
          // Set defaultValue to "" if you want the placeholder to be initially selected and no default value is set via useForm
          defaultValue={rest.defaultValue || ''} // Important for the placeholder option to work correctly alongside react-hook-form defaultValues
        >
          {/* Placeholder Option */}
          {placeholder && (
            <option value='' disabled>
              {placeholder}
            </option>
          )}

          {/* Map through the options array to create option elements */}
          {opt.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className='text-gray-900'
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Arrow Icon */}
        <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
          <svg
            className={`w-5 h-5 ${error ? 'text-red-400' : 'text-gray-400'}`}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <span className='text-xs text-gray-500 pl-1'>{helperText}</span>
      )}

      {/* Error Message */}
      {error && (
        <span className='text-xs text-red-500 font-medium pl-1 flex items-center gap-1'>
          {/* Error Icon */}
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
          {error.message}
        </span>
      )}
    </div>
  );
};

export default SelectField;
