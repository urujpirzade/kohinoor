'use client';

import { SessionProvider } from 'next-auth/react';

const AuthProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  return (
    <div>
      <SessionProvider session={session}>{children}</SessionProvider>
    </div>
  );
};
export default AuthProvider;
