import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SignInViewPage from '@/components/auth/signin-view';

export const metadata: Metadata = {
  title: 'Venue Booking | Sign In',
  description: 'Sign in to your Venue Booking account.',
};

export default async function Page() {
  // Check if user is already authenticated
  const session = await getServerSession(authOptions);

  // If already signed in, redirect to dashboard
  if (session) {
    return redirect('/');
  }

  return <SignInViewPage />;
}
