import prisma from '@/lib/db';
import { signUpSchema } from '@/schema/schema';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
export async function POST(request: Request) {
  const body = await request.json();
  const validatedData = signUpSchema.safeParse(body);
  if (!validatedData.success) {
    return NextResponse.json(validatedData.error.errors, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(validatedData.data.password, 12);
  try {
    const data1 = await prisma.user.create({
      data: {
        id: validatedData.data.id,
        username: validatedData.data.username,
        hashedPassword: hashedPassword,
        contact: validatedData.data.contact,
        firstName: validatedData.data.firstName,
        middleName: validatedData.data.middleName,
        lastName: validatedData.data.lastName,
        role: validatedData.data.role,
      },
    });
    console.log(data1);
  } catch (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json(validatedData);
}
