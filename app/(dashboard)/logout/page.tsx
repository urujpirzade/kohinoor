'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut({ redirect: false });
      router.push('/login');
    };

    handleLogout();
  }, [router]);

  // Optional loading state
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <p>Signing out...</p>
    </div>
  );
}
