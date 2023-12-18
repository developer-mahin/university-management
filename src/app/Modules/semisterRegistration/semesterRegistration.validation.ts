import { z } from 'zod';

const createSemesterRegistrationSchema = z.object({
  academicSemester: z.string().refine((value) => value.length > 0, {
    message: 'Academic semester is required',
  }),
  status: z.enum(['UPCOMING', 'ONGOING', 'ENDED']).default('UPCOMING'),
  startDate: z.date(),
  endDate: z.date(),
  minCredit: z.number(),
  maxCredit: z.number(),
});

const updateSemesterRegistrationSchema = z.object({
  academicSemester: z
    .string()
    .refine((value) => value.length > 0, {
      message: 'Academic semester is required',
    })
    .optional(),
  status: z
    .enum(['UPCOMING', 'ONGOING', 'ENDED'])
    .default('UPCOMING')
    .optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minCredit: z.number().optional(),
  maxCredit: z.number().optional(),
});

export const semesterRegistration = {
  createSemesterRegistrationSchema,
  updateSemesterRegistrationSchema,
};
