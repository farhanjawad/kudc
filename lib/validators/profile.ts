import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number'),
  studentId: z.string().min(4, 'Student ID is required'),
  discipline: z.enum(['Computer Science', 'Information Technology', 'Engineering', 'Other']),
  gender: z.enum(['male', 'female', 'other']),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
