'use client';

import { SignUpSchema, signUpSchema } from '@/schema/schema';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from './InputField';
import { createUser, updateUser } from '@/lib/actions';
import SelectField from './selectField';
import { toast } from 'react-toastify';

const UserForm = ({
  type,
  data,
}: {
  type: 'create' | 'update';
  data?: Partial<SignUpSchema>;
}) => {
  // Set default values for the form
  const initialValues: Partial<SignUpSchema> & { id?: string } = {
    id: data?.id,
    ...data,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: initialValues,
  });

  // Valid submit handler receives the parsed form data
  const onValidSubmit: SubmitHandler<SignUpSchema> = async (formData) => {
    console.log('✅ onValidSubmit triggered', formData);

    let result;
    if (type === 'create') {
      result = await createUser(formData);
    } else {
      result = await updateUser(formData);
    }

    if (result) toast(result.message);
    if (result?.success) {
      setTimeout(() => window.location.reload(), 2500);
    }
  };

  // Invalid submit handler receives validation errors
  const onInvalidSubmit: SubmitErrorHandler<SignUpSchema> = (formErrors) => {
    console.log('🚨 Validation Errors:', formErrors);
  };

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
      className='w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 space-y-8'
    >
      {/* Header */}
      <div className='border-b pb-4'>
        <h1 className='text-3xl font-bold text-gray-800'>
          {type === 'create' ? 'Create New User' : 'Update User'}
        </h1>
        <p className='text-sm text-gray-500 mt-2'>
          Complete the user details below to{' '}
          {type === 'create' ? 'new User' : 'modify User'}.
        </p>
      </div>

      {/* User Basic Info */}
      <div className='space-y-6'>
        <div className='flex items-center gap-2'>
          <div className='h-6 w-1 bg-blue-600 rounded-full'></div>
          <h2 className='text-xl font-semibold text-gray-700'>
            Login Information
          </h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          <InputField
            label='Username'
            name='username'
            register={register}
            error={errors.username}
            placeholder='Set Username'
            required
          />
          <InputField
            label='Create Password'
            name='password'
            register={register}
            error={errors.password}
            placeholder='Set Password'
            required
          />

          <SelectField
            label='Role'
            name='role'
            register={register}
            error={errors.role}
            placeholder='Assign role'
            required
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className='space-y-6'>
        <div className='flex items-center gap-2'>
          <div className='h-6 w-1 bg-amber-500 rounded-full'></div>
          <h2 className='text-xl font-semibold text-gray-700'>
            Contact Information
          </h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          <InputField
            label='First Name'
            name='firstName'
            register={register}
            error={errors.firstName}
            placeholder='First Name'
            required
          />
          <InputField
            label='Middle Name'
            name='middleName'
            register={register}
            error={errors.middleName}
            placeholder='Middle Name'
          />
          <InputField
            label='Last Name'
            name='lastName'
            register={register}
            error={errors.lastName}
            placeholder='Last Name'
            required
          />
          <InputField
            label='Contact Number'
            name='contact'
            register={register}
            error={errors.contact}
            placeholder='Phone number'
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className='pt-6 border-t'>
        <div className='flex justify-end gap-4'>
          <button
            onClick={() => window.location.reload()}
            type='button'
            className='px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2'
          >
            {isSubmitting && (
              <svg
                className='animate-spin h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            )}
            {type === 'create' ? 'Create User' : 'Update User'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
