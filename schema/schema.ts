import { z } from 'zod';

export const signInSchema = z.object({
  username: z.string().min(3, 'Username must contain atleast 3 characters.'),
  password: z.string().min(4, 'Password must contain atleast 4 characters.'),
});

export const signUpSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, 'Username must contain atleast 3 characters.'),
  password: z.string().min(4, 'Password must contain atleast 4 characters.'),
  contact: z.string().min(6, 'min length 6 digits.'),
  firstName: z.string().min(1, 'Name must contain atleast 1 characters.'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Surname must contain atleast 1 characters.'),
  role: z.enum(['ROOT', 'ADMIN', 'MANAGER', 'USER']),
  image: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const eventSchema = z.object({
  id: z.number().int().optional(),
  client_name: z.string().min(3, 'name is required, min 3 characters long.'),
  email: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Allow empty/undefined
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val);
      },
      { message: 'Invalid email format' },
    ),
  date: z.coerce.date(),
  start_time: z
    .string()
    .refine((val) => (val ? /^([01]\d|2[0-3]):([0-5]\d)$/.test(val) : true), {
      message: 'Invalid time format, expected HH:MM',
    }),
  end_time: z
    .string()
    .refine((val) => (val ? /^([01]\d|2[0-3]):([0-5]\d)$/.test(val) : true), {
      message: 'Invalid time format, expected HH:MM',
    }),
  contact: z.string(),
  address: z.string().optional(),
  event_name: z
    .string()
    .min(1, 'Event type is required (e.g., Wedding, Birthday)'),

  hall: z.enum(['mainHall', 'secondHall'], {
    required_error: 'Hall/Venue name is required',
    invalid_type_error: 'Invalid Hall value provided',
  }),
  bookingBy: z.string().optional(),
  reference: z.string().optional(),
  hallHandover: z.boolean().optional(),
  decoration: z.boolean().optional(),
  catering: z.boolean().optional(),
  kitchen: z.boolean().optional(),
  details: z.string().optional(),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0).default(0),
  ),
  advance: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0).default(0),
  ),
  balance: z
    .number()
    .int('Balance must be an integer')
    .min(0, 'Balance cannot be negative')
    .default(0),
  createdAt: z.coerce.date().optional(), // Better date handling
  updatedAt: z.coerce.date().optional(),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type EventSchema = z.infer<typeof eventSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;

// Type for User from database (with hashedPassword instead of password)
export type UserFromDB = Omit<SignUpSchema, 'password'> & {
  hashedPassword: string;
};
