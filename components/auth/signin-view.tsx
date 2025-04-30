'use client';

import Image from 'next/image';
import UserAuthForm from './user-auth-form';
import { useSearchParams } from 'next/navigation';

export default function SignInViewPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className='h-screen flex flex-col md:grid md:grid-cols-1 lg:grid-cols-2 overflow-hidden'>
      <div className='relative hidden lg:flex flex-col bg-zinc-900 text-white'>
        <div className='absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950' />
        <div className='relative z-10 flex h-full items-center justify-center p-8'>
          <div className='text-center'>
            <Image
              src='/logo.jpg'
              alt='Company Logo'
              width={450}
              height={450}
              className='rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-indigo-500'
              priority
            />
          </div>
        </div>
      </div>

      {/* Right panel - sign in form */}
      <div className='flex flex-1 items-center justify-center p-6 sm:p-8 md:p-10'>
        <div className='w-full max-w-md space-y-8'>
          {/* Mobile logo */}
          <div className='flex lg:hidden items-center justify-center mb-6'>
            <Image
              src='/logo_water.png'
              alt='Company Logo'
              height={65}
              width={200}
              className='transform transition-all duration-300 hover:scale-105'
            />
          </div>

          <div className='space-y-6'>
            <div className='space-y-3 text-center'>
              <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
                Welcome back
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Sign in to your account to continue
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className='p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm animate-appear'>
                {error === 'CredentialsSignin'
                  ? 'Invalid username or password. Please try again.'
                  : 'An error occurred during sign in. Please try again.'}
              </div>
            )}

            <UserAuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
