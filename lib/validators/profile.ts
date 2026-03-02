import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Official Khulna University Disciplines
export const kuDisciplines = [
  'Architecture', 'Computer Science and Engineering', 'Electronics and Communication Engineering', 
  'Urban and Rural Planning', 'Mathematics', 'Physics', 'Chemistry', 'Statistics',
  'Forestry and Wood Technology', 'Fisheries and Marine Resource Technology', 
  'Biotechnology and Genetic Engineering', 'Agrotechnology', 'Pharmacy', 'Environmental Science',
  'Business Administration', 'Human Resource Management', 
  'Economics', 'Sociology', 'Development Studies', 'Mass Communication and Journalism', 
  'English', 'History and Civilization', 'Law', 
  'Drawing and Painting', 'Printmaking', 'Sculpture', 'Other'
] as const;

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number'),
  gender: z.enum(['male', 'female']),
  discipline: z.enum(kuDisciplines).catch(() => kuDisciplines[0]),
  
  userType: z.enum(['student', 'staff']),
  
  // FIX: Preprocess the string "true" from the HTML radio button into a real boolean!
  wantsToBuyBook: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
  
  studentId: z.string().optional(),
  designation: z.string().optional(),
  transactionId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.userType === 'student' && (!data.studentId || data.studentId.trim() === '')) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Student ID is required", path: ["studentId"] });
  }
  
  if (data.userType === 'staff' && (!data.designation || data.designation.trim() === '')) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Designation is required", path: ["designation"] });
  }

  if (data.wantsToBuyBook && (!data.transactionId || data.transactionId.trim() === '')) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Transaction ID is required to process your book order", path: ["transactionId"] });
  }
});

export type ProfileFormValues = z.infer<typeof profileSchema>;