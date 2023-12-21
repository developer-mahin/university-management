import { z } from 'zod';

const createAdminNameSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
});

export const createAdminSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    admin: z.object({
      designation: z.string().min(1, 'Designation is required'),
      name: createAdminNameSchema,
      gender: z.enum(['Male', 'Female', 'Others']),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      dateOfBirth: z.string().min(1, 'Date of birth is required'),
      email: z.string().min(1, 'Email is required'),
      contactNo: z.string().min(1, 'Contact number is required'),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number is required'),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      profileImage: z.string().min(1, 'Profile image is required'),
      academicDepartment: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

const updateAdminNameSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
});

export const updateAdminSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    admin: z.object({
      designation: z.string().min(1, 'Designation is required').optional(),
      name: updateAdminNameSchema,
      gender: z.enum(['Male', 'Female', 'Others']).optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      dateOfBirth: z.string().min(1, 'Date of birth is required').optional(),
      email: z.string().min(1, 'Email is required').optional(),
      contactNo: z.string().min(1, 'Contact number is required').optional(),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency contact number is required')
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      profileImage: z.string().min(1, 'Profile image is required').optional(),
      academicDepartment: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

export const AdminSchemaValidation = {
  createAdminSchema,
  updateAdminSchema,
};
