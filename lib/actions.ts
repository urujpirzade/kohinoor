'use server';

import {
  EventSchema,
  eventSchema,
  SignUpSchema,
  signUpSchema,
} from '@/schema/schema';
import bcrypt from 'bcryptjs';
import prisma from './db';

export const createEvent = async (data: EventSchema) => {
  try {
    const validationResult = eventSchema.safeParse(data);
    if (!validationResult.success) {
      console.error('Zod validation failed:', validationResult.error.issues);
      return {
        success: false,
        error: true,
        message: 'Invalid data provided.',
      };
    }
    const createDataPayload = validationResult.data;
    const { id, ...validatedData } = createDataPayload;
    const hallname: any = validatedData.hall;
    const timeValidation = validatedData.start_time < validatedData.end_time;

    if (!timeValidation) {
      return {
        success: false,
        error: true,
        message: 'Start time must be less than End time.',
      };
    }
    if (validatedData.amount < validatedData.advance) {
      return {
        success: false,
        error: true,
        message: 'Total "Amount" must be greater than "Advance".',
      };
    }
    const balance = validatedData.amount - validatedData.advance;
    const existingEvent = await prisma?.event.findFirst({
      where: {
        AND: [
          { date: validatedData.date },
          { hall: hallname },
          { start_time: { lt: validatedData.end_time } },
          { end_time: { gt: validatedData.start_time } },
        ],
      },
    });

    if (existingEvent) {
      return {
        success: false,
        error: true,
        message: 'Event already exists on the given date.',
      };
    }

    const eventCreated = await prisma?.event.create({
      data: { ...validatedData, balance },
    });

    console.log('Event created successfully:', eventCreated);

    // 4. Return success response
    return {
      success: true,
      error: false,
      message: 'Event created successfully.',
      data: eventCreated,
    };
  } catch (error) {
    console.error('Error creating event:', error);

    return {
      success: false,
      error: true,
      message: 'An unexpected error occurred while creating the event.',
    };
  }
};

export const updateEvent = async (data: EventSchema) => {
  try {
    if (!data.id) {
      return {
        success: false,
        error: true,
        message: 'Event ID is required for update.',
      };
    }
    console.log(data);

    const eventIdToUpdate = data.id;
    const validationResult = eventSchema.safeParse(data);
    if (!validationResult.success) {
      console.error('Zod validation failed:', validationResult.error.issues);
      return {
        success: false,
        error: true,
        message: 'Invalid data provided.',
      };
    }
    const validatedData = validationResult.data;
    const hallname: any = validatedData.hall;
    const timeValidation = validatedData.start_time < validatedData.end_time;

    if (!timeValidation) {
      return {
        success: false,
        error: true,
        message: 'Start time must be less than End time.',
      };
    }
    if (validatedData.amount < validatedData.advance) {
      return {
        success: false,
        error: true,
        message: 'Total "Amount" must be greater than "Advance".',
      };
    }
    const balance = validatedData.amount - validatedData.advance;
    const existingEvent = await prisma?.event.findFirst({
      where: {
        AND: [
          { id: { not: eventIdToUpdate } },
          { date: validatedData.date },
          { hall: hallname },
          { start_time: { lt: validatedData.end_time } },
          { end_time: { gt: validatedData.start_time } },
        ],
      },
    });

    if (existingEvent) {
      return {
        success: false,
        error: true,
        message: 'Event already exists on the given date.',
      };
    }
    const { id, ...updateDataPayload } = validatedData;
    console.log(id);

    const eventUpdated = await prisma?.event.update({
      where: {
        id: eventIdToUpdate, // Use the stored ID for the where clause
      },
      data: { ...updateDataPayload, balance },
    });

    console.log('Event updated successfully:', eventUpdated);

    // 4. Return success response
    return {
      success: true,
      error: false,
      message: 'Event updated successfully.',
      data: eventUpdated,
    };
  } catch (error: any) {
    console.error('Error updating event:', error); // Log the actual error

    // Handle specific Prisma error for record not found during update
    if (error.code === 'P2025') {
      // Prisma error code for "Record to update not found."
      return {
        success: false,
        error: true,
        message: 'Event not found. Could not update.',
      };
    }

    // Return a generic error message for other errors
    return {
      success: false,
      error: true,
      message: 'An unexpected error occurred while updating the event.',
    };
  }
};

export const deleteEvent = async (id: number) => {
  try {
    const deleteEvent = await prisma?.event.delete({
      where: { id },
    });
    console.log(deleteEvent);
    return {
      success: true,
      error: false,
      message: 'Event deleted Successfully.',
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: true,
      message: error,
    };
  }
};

export const createUser = async (data: SignUpSchema) => {
  try {
    const validationResult = signUpSchema.safeParse(data);
    if (!validationResult.success) {
      console.error('Zod validation failed:', validationResult.error.issues);
      return {
        success: false,
        error: true,
        message: 'Invalid data provided.',
      };
    }
    const validatedData = validationResult.data;

    const existingUser = await prisma?.user.findFirst({
      where: {
        username: validatedData?.username,
      },
    });
    const existingContact = await prisma?.user.findFirst({
      where: {
        contact: validatedData?.contact,
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: true,
        message: 'Username is already taken!',
      };
    }
    if (existingContact) {
      return {
        success: false,
        error: true,
        message: 'Contact number is already taken!',
      };
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const { password, ...creteUser } = { ...data };

    const userCreated = await prisma?.user.create({
      data: { ...creteUser, hashedPassword, image: '' },
    });

    console.log('User created successfully:', userCreated);

    // 4. Return success response
    return {
      success: true,
      error: false,
      message: 'User created successfully.',
      data: userCreated,
    };
  } catch (error) {
    console.error('Error creating user:', error);

    return {
      success: false,
      error: true,
      message: 'An unexpected error occurred while creating the user.',
    };
  }
};

export const updateUser = async (data: SignUpSchema) => {
  try {
    if (!data.id) {
      return {
        success: false,
        error: true,
        message: 'User ID is required for update.',
      };
    }
    console.log(data);

    const userIdToUpdate = data.id;
    const validationResult = signUpSchema.safeParse(data);
    if (!validationResult.success) {
      console.error('Zod validation failed:', validationResult.error.issues);
      return {
        success: false,
        error: true,
        message: 'Invalid data provided.',
      };
    }
    const validatedData = validationResult.data;

    const existingUser = await prisma?.user.findFirst({
      where: {
        AND: [
          { id: { not: userIdToUpdate } },
          { username: validatedData.username },
          { contact: validatedData.contact },
        ],
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: true,
        message: 'Username or Contact Number is already taken.',
      };
    }
    const { id, password, ...updateDataPayload } = validatedData;
    console.log(id);
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const userUpdated = await prisma?.user.update({
      where: {
        id: userIdToUpdate, // Use the stored ID for the where clause
      },
      data: { ...updateDataPayload, hashedPassword },
    });

    console.log('User updated successfully:', userUpdated);

    // 4. Return success response
    return {
      success: true,
      error: false,
      message: 'User updated successfully.',
      data: userUpdated,
    };
  } catch (error: any) {
    console.error('Error updating user:', error); // Log the actual error

    // Handle specific Prisma error for record not found during update
    if (error.code === 'P2025') {
      // Prisma error code for "Record to update not found."
      return {
        success: false,
        error: true,
        message: 'User not found. Could not update.',
      };
    }

    // Return a generic error message for other errors
    return {
      success: false,
      error: true,
      message: 'An unexpected error occurred while updating the user.',
    };
  }
};

export const deleteUser = async (id: string) => {
  try {
     const user = await prisma?.user.findUnique({
      where: { id },
    });

    if (user?.role === 'ADMIN') {
      const count = await prisma?.user.count({
        where: { role: 'ADMIN' },
      });
      if (count === 1)
        return {
          success: false,
          error: true,
          message: 'Last Admin, Atleast one admin must be present.',
        };
    }
    const deleteUser = await prisma?.user.delete({
      where: { id },
    });
    console.log(deleteUser);
    return {
      success: true,
      error: false,
      message: 'User deleted Successfully.',
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: true,
      message: error,
    };
  }
};
