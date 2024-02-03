import { z } from 'zod';

const createSemesterRegistrationSchema = z.object({
  body: z.object({
    academicSemester: z.string().refine((value) => value.length > 0, {
      message: 'Academic semester is required',
    }),
    status: z.enum(['UPCOMING', 'ONGOING', 'ENDED']).default('UPCOMING'),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z.number(),
    maxCredit: z.number(),
  }),
});

const updateSemesterRegistrationSchema = z.object({
  body: z.object({
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
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

export const semesterRegistration = {
  createSemesterRegistrationSchema,
  updateSemesterRegistrationSchema,
};
