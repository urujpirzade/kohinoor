// lib/db.ts

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => new PrismaClient();

const prisma =
  process.env.NODE_ENV === 'production'
    ? prismaClientSingleton()
    : (globalThis as any).prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).prisma = prisma;
}

export default prisma;
