import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/provider/AuthProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Venue Booking Application',
  description: 'Developed by Girish Digge.',
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider session={session}>
          {children}
          <ToastContainer position='bottom-right' theme='dark' />
        </AuthProvider>
      </body>
    </html>
  );
}
