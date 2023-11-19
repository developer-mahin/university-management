import { z } from 'zod';
import isEmail from 'validator/lib/isEmail';

// Zod schema for Name
const NameValidationSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name can't be less than 3 characters" })
    .max(20, { message: "First name can't be more than 20 characters" }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(3, { message: "Last name can't be less than 3 characters" })
    .max(20, { message: "Last name can't be more than 20 characters" }),
});

// Zod schema for Guardian
const GuardianValidationSchema = z.object({
  fathersName: z.string().min(1, { message: "Father's name is required." }),
  fathersOccupation: z
    .string()
    .min(1, { message: "Father's occupation is required." }),
  fathersContactNumber: z
    .string()
    .min(1, { message: "Father's contact number is required." }),
  mothersName: z.string().min(1, { message: "Mother's name is required." }),
  mothersOccupation: z
    .string()
    .min(1, { message: "Mother's occupation is required." }),
  mothersContactNumber: z
    .string()
    .min(1, { message: "Mother's contact number is required." }),
});

// Zod schema for LocalGuardian
const LocalGuardianValidationSchema = z.object({
  name: z.string().min(1, { message: 'Local guardian name is required.' }),
  occupation: z
    .string()
    .min(1, { message: 'Local guardian occupation is required.' }),
  contactNumber: z
    .string()
    .min(1, { message: 'Local guardian contact number is required.' }),
  emailAddress: z
    .string()
    .min(1, { message: 'Local guardian email address is required.' }),
  address: z.object({
    village: z
      .string()
      .min(1, { message: 'Local guardian village is required.' }),
    city: z.string().min(1, { message: 'Local guardian city is required.' }),
    home: z.string().min(1, { message: 'Local guardian home is required.' }),
  }),
});

// Zod schema for Student
const StudentValidationSchema = z.object({
  id: z.string().min(1, { message: 'Student ID is required.' }),
  name: NameValidationSchema,
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required.' }),
  age: z.number().min(1, { message: 'Age is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .refine(isEmail, { message: 'You have to add valid email address' }),
  gender: z.enum(['male', 'female']),
  contactNumber: z.string().min(1, { message: 'Contact number is required.' }),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  presentAddress: z
    .string()
    .min(1, { message: 'Present address is required.' }),
  permanentAddress: z
    .string()
    .min(1, { message: 'Permanent address is required.' }),
  guardian: GuardianValidationSchema,
  localGuardian: LocalGuardianValidationSchema,
  profilePic: z.string().min(1, { message: 'Profile picture is required.' }),
  isActive: z.enum(['active', 'blocked']).default('active'),
});

export default StudentValidationSchema;
