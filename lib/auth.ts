import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/db';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions = {
  session: {
    strategy: 'jwt' as const,
    maxAge: 365 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials ?? {};

        if (!username || !password) {
          throw new Error('Please enter both username and password.');
        }

        const user = await prisma.user.findUnique({ where: { username } });

        if (!user || !user.hashedPassword) {
          throw new Error('User not found. Please check your username.');
        }

        const isMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!isMatch) {
          throw new Error('Incorrect password.');
        }

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.name = `${user.firstName} ${user.lastName}`;
        token.image = user.image;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          id: token.id,
          username: token.username,
          name: token.name,
          role: token.role,
          image: token.image ?? null,
        };
      }

      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
