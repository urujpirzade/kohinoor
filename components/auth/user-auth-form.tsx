'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Please enter username' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters' }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [loading, startTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    setAuthError(null);

    startTransition(async () => {
      try {
        const result = await signIn('credentials', {
          username: data.username,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setAuthError(result.error);
          toast.error('Login failed. Please check your credentials.');
        } else {
          toast.success('Signed in successfully!');
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (error) {
        console.error('Sign in error:', error);
        toast.error('An unexpected error occurred');
      }
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-5'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className='text-sm font-medium'>Username</FormLabel>
              <div className='relative'>
                <div className='absolute left-3 top-3 text-gray-400'>
                  <User size={16} />
                </div>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Enter your username'
                    disabled={loading}
                    autoComplete='username'
                    className='pl-10 py-6 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className='text-xs font-medium text-red-500' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className='text-sm font-medium'>Password</FormLabel>
              <div className='relative'>
                <div className='absolute left-3 top-3 text-gray-400'>
                  <Lock size={16} />
                </div>
                <FormControl>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    disabled={loading}
                    autoComplete='current-password'
                    className='pl-10 py-6 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                    {...field}
                  />
                </FormControl>
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none'
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FormMessage className='text-xs font-medium text-red-500' />
            </FormItem>
          )}
        />

        {authError && (
          <div className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-center justify-center'>
            {authError}
          </div>
        )}

        <Button
          disabled={loading}
          className='w-full py-6 bg-black/90 hover:bg-black text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-indigo-300'
          type='submit'
        >
          {loading ? (
            <div className='flex items-center justify-center'>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
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
              Signing in...
            </div>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </Form>
  );
}
